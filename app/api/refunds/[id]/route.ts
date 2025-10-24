import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { refund, orders, order_status } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const refundId = Number(id);
  const body = await req.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json(
      { error: "Status is required" },
      { status: 400 }
    );
  }

  try {
      
    const [existingRefund] = await db
      .select()
      .from(refund)
      .where(eq(refund.refund_id, refundId))
      .limit(1);

    if (!existingRefund) {
      return NextResponse.json(
        { error: "Refund not found" },
        { status: 404 }
      );
    }

      
    const [refundProcessingStatus] = await db
      .select()
      .from(order_status)
      .where(eq(order_status.order_status_name, "refund processing"))
      .limit(1);

    if (!refundProcessingStatus) {
      return NextResponse.json(
        { error: "Refund processing status not found" },
        { status: 500 }
      );
    }

      
    const [updatedRefund] = await db
      .update(refund)
      .set({ 
        status,
        updated_at: new Date()
      })
      .where(eq(refund.refund_id, refundId))
      .returning();

      
    await db
      .update(orders)
      .set({ 
        order_status_id: refundProcessingStatus.order_status_id,
        updated_at: new Date()
      })
      .where(eq(orders.order_id, existingRefund.order_id));

    console.log(`✅ Updated refund #${refundId} and order #${existingRefund.order_id} to refund processing`);

    return NextResponse.json({
      success: true,
      refund: updatedRefund,
      message: "Refund submitted and order status updated to refund processing"
    });
  } catch (err) {
    console.error("Error updating refund:", err);
    return NextResponse.json(
      { error: "Failed to update refund" },
      { status: 500 }
    );
  }
}