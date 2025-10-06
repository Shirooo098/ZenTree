// app/api/order/cancel/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders, order_status } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "InvalorderId order orderId" },
        { status: 400 }
      );
    }

    const cancelledStatus = await db.query.order_status.findFirst({
      where: eq(order_status.order_status_name, "Cancelled")
    });

    if (!cancelledStatus) {
      return NextResponse.json(
        { error: "Cancelled status not found" },
        { status: 500 }
      );
    }

    const updatedOrder = await db
      .update(orders)
      .set({
        order_status_id: cancelledStatus.order_status_id,
        updated_at: new Date()
      })
      .where(eq(orders.order_id, orderId))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}