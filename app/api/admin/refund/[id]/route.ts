  
import { createAuditLog, getRequestMetadata } from "@/app/lib/audit-server.action";
import { db } from "@/db/drizzle";
import { refund, refund_items, products, orders, order_status } from "@/db/schema";
import { getCurrentUser } from "@/server/users";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "staff") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Staff access required" },
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

      
    const { ipAddress, userAgent } = await getRequestMetadata();
    let updatedRefund;
    let updatedOrder;

    await db.transaction(async (tx) => {
        
      const [existingRefund] = await tx
        .select()
        .from(refund)
        .where(eq(refund.refund_id, refundId))
        .limit(1);

      if (!existingRefund) {
        throw new Error("Refund not found");
      }

        
      const [oldOrder] = await tx
        .select()
        .from(orders)
        .where(eq(orders.order_id, existingRefund.order_id))
        .limit(1);

        
      let orderStatusName: string;
      if (newStatus === 'approved') {
        orderStatusName = 'refunded';
      } else if (newStatus === 'rejected') {
        orderStatusName = 'refund rejected';
      } else {
        orderStatusName = 'refund processing';
      }

        
      const [targetOrderStatus] = await tx
        .select()
        .from(order_status)
        .where(eq(order_status.order_status_name, orderStatusName))
        .limit(1);

      if (!targetOrderStatus) {
        throw new Error(`Order status "${orderStatusName}" not found`);
      }

        
      [updatedRefund] = await tx
        .update(refund)
        .set({
          status: newStatus,
          admin_notes: admin_notes || null,
          processed_by: session.id,
          updated_at: new Date()
        })
        .where(eq(refund.refund_id, refundId))
        .returning();

        
      await createAuditLog({
        userId: session.id,
        action: 'update',
        tableName: 'refund',
        recordId: refundId,
        oldValues: {
          status: existingRefund.status,
          admin_notes: existingRefund.admin_notes,
        },
        newValues: {
          status: updatedRefund.status,
          admin_notes: updatedRefund.admin_notes,
        },
        ipAddress,
        userAgent,
      });

        
      [updatedOrder] = await tx
        .update(orders)
        .set({
          order_status_id: targetOrderStatus.order_status_id,
          updated_by: session.id,
          updated_at: new Date()
        })
        .where(eq(orders.order_id, existingRefund.order_id))
        .returning();

        
      await createAuditLog({
        userId: session.id,
        action: 'update',
        tableName: 'orders',
        recordId: existingRefund.order_id,
        oldValues: {
          order_status_id: oldOrder.order_status_id,
        },
        newValues: {
          order_status_id: updatedOrder.order_status_id,
        },
        ipAddress,
        userAgent,
      });

      console.log(`✅ Updated refund #${refundId} to ${newStatus}`);
      console.log(`✅ Updated order #${existingRefund.order_id} to ${orderStatusName}`);

        
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

          
        for (const item of items) {
          const condition = item_conditions[item.refund_item_id];
          
          if (!condition) {
            throw new Error(`Missing condition for item ${item.refund_item_id}`);
          }

          const isResellable = condition === 'resellable';

            
          const [oldProduct] = await tx
            .select()
            .from(products)
            .where(eq(products.product_id, item.product_id))
            .limit(1);

            
          await tx
            .update(refund_items)
            .set({
              condition: condition,
              restocked: isResellable,
              restocked_at: isResellable ? new Date() : null
            })
            .where(eq(refund_items.refund_item_id, item.refund_item_id));

          console.log(`  ↳ Item #${item.refund_item_id}: ${condition}, restocked: ${isResellable}`);

            
          if (isResellable) {
            const [updatedProduct] = await tx
              .update(products)
              .set({
                stock: sql`${products.stock} + ${item.quantity}`,
                updated_by: session.id,
                updated_at: new Date()
              })
              .where(eq(products.product_id, item.product_id))
              .returning();

              
            await createAuditLog({
              userId: session.id,
              action: 'update',
              tableName: 'products',
              recordId: item.product_id,
              oldValues: {
                stock: oldProduct.stock,
              },
              newValues: {
                stock: updatedProduct.stock,
              },
              ipAddress,
              userAgent,
              metadata: {
                reason: 'refund_restock',
                refund_id: refundId,
                refund_item_id: item.refund_item_id,
                quantity_restored: item.quantity
              }
            });

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