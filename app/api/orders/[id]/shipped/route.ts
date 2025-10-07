import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { order_status, orders, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
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

    const { id } = await params
    const orderId = Number(id)
    
    if (isNaN(orderId) || !orderId) {
      return NextResponse.json(
        { error: `Invalid order ID: ${orderId}` },
        { status: 400 }
      );
    }

    // Parse request body
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

    await db
      .update(orders)
      .set({
        order_status_id: orderStatus.order_status_id,
        payment_status: payment_status,
        updated_at: new Date()
      })
      .where(eq(orders.order_id, orderId));

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