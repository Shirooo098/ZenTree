  
import { createAuditLog, getRequestMetadata } from "@/app/lib/audit-server.action";
import { db } from "@/db/drizzle";
import { order_status, orders } from "@/db/schema";
import { getCurrentUser } from "@/server/users";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId) || !orderId) {
      return NextResponse.json(
        { error: `Invalid order ID: ${orderId}` },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const statusNameLower = status.toLowerCase();

    const [orderStatus] = await db
      .select()
      .from(order_status)
      .where(eq(order_status.order_status_name, statusNameLower))
      .limit(1);

    if (!orderStatus) {
      return NextResponse.json(
        { error: `Invalid order status: ${status}` },
        { status: 400 }
      );
    }

      
    const [oldOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.order_id, orderId))
      .limit(1);

    if (!oldOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    let payment_status: string;
    
    switch (statusNameLower) {
      case 'paid':
      case 'processing':
      case 'shipped':
      case 'delivered':
        payment_status = 'completed';
        break;
      case 'cancelled':
        payment_status = 'cancelled';
        break;
      case 'refunded':
        payment_status = 'refunded';
        break;
      case 'pending':
      default:
        payment_status = 'pending';
        break;
    }

      
    const [updatedOrder] = await db
      .update(orders)
      .set({
        order_status_id: orderStatus.order_status_id,
        payment_status: payment_status,
        updated_by: session.id,
        updated_at: new Date()
      })
      .where(eq(orders.order_id, orderId))
      .returning();

      
    const { ipAddress, userAgent } = await getRequestMetadata();
    await createAuditLog({
      userId: session.id,
      action: 'update',
      tableName: 'orders',
      recordId: orderId,
      oldValues: {
        order_status_id: oldOrder.order_status_id,
        payment_status: oldOrder.payment_status,
      },
      newValues: {
        order_status_id: updatedOrder.order_status_id,
        payment_status: updatedOrder.payment_status,
      },
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order_id: orderId,
      new_status: status,
      payment_status: payment_status
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}