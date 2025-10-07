// app/api/admin/refund/[id]/route.ts
import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { refund, refund_items, user, products, orders, order_status } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [currentUser] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const refundId = Number(id);

    if (isNaN(refundId) || !refundId) {
      return NextResponse.json(
        { error: `Invalid refund ID: ${refundId}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status: newStatus, admin_notes, item_conditions } = body;

    console.log("📝 Admin updating refund:", {
      refundId,
      newStatus,
      admin_notes: admin_notes?.substring(0, 50),
      item_conditions_count: item_conditions ? Object.keys(item_conditions).length : 0
    });

    if (!newStatus) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    await db.transaction(async (tx) => {
      // Get the refund to find the associated order
      const [existingRefund] = await tx
        .select()
        .from(refund)
        .where(eq(refund.refund_id, refundId))
        .limit(1);

      if (!existingRefund) {
        throw new Error("Refund not found");
      }

      // Determine the order status based on refund status
      let orderStatusName: string;
      if (newStatus === 'approved') {
        orderStatusName = 'refunded';
      } else if (newStatus === 'rejected') {
        orderStatusName = 'refund rejected';
      } else {
        orderStatusName = 'refund processing'; // for pending
      }

      // Get the order status ID
      const [targetOrderStatus] = await tx
        .select()
        .from(order_status)
        .where(eq(order_status.order_status_name, orderStatusName))
        .limit(1);

      if (!targetOrderStatus) {
        throw new Error(`Order status "${orderStatusName}" not found`);
      }

      // Update refund status
      await tx
        .update(refund)
        .set({
          status: newStatus,
          admin_notes: admin_notes || null,
          processed_by: session.user.id,
          updated_at: new Date()
        })
        .where(eq(refund.refund_id, refundId));

      // Update order status
      await tx
        .update(orders)
        .set({
          order_status_id: targetOrderStatus.order_status_id,
          updated_at: new Date()
        })
        .where(eq(orders.order_id, existingRefund.order_id));

      console.log(`✅ Updated refund #${refundId} to ${newStatus}`);
      console.log(`✅ Updated order #${existingRefund.order_id} to ${orderStatusName}`);

      // If approving, process items
      if (newStatus === 'approved') {
        if (!item_conditions || Object.keys(item_conditions).length === 0) {
          throw new Error("Item conditions are required when approving a refund");
        }

        const items = await tx
          .select()
          .from(refund_items)
          .where(eq(refund_items.refund_id, refundId));

        if (items.length === 0) {
          throw new Error("No items found for this refund");
        }

        console.log(`  Processing ${items.length} items...`);

        // Process each item
        for (const item of items) {
          const condition = item_conditions[item.refund_item_id];
          
          if (!condition) {
            throw new Error(`Missing condition for item ${item.refund_item_id}`);
          }

          const isResellable = condition === 'resellable';

          // Update refund item with condition
          await tx
            .update(refund_items)
            .set({
              condition: condition,
              restocked: isResellable,
              restocked_at: isResellable ? new Date() : null
            })
            .where(eq(refund_items.refund_item_id, item.refund_item_id));

          console.log(`  ↳ Item #${item.refund_item_id}: ${condition}, restocked: ${isResellable}`);

          // If resellable, restore stock
          if (isResellable) {
            await tx
              .update(products)
              .set({
                stock: sql`${products.stock} + ${item.quantity}`
              })
              .where(eq(products.product_id, item.product_id));

            console.log(`  ↳ Restored ${item.quantity} units to product #${item.product_id}`);
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Refund ${newStatus} successfully and order status updated`,
      refund_id: refundId,
      new_status: newStatus
    });

  } catch (error) {
    console.error("❌ Error updating refund:", error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to update refund status",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}