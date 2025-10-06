// cancel-order/route.ts
import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { order_status, orders } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('order_id');

        if (orderId) {
            // Update order status to "cancelled"
            const cancelledStatus = await db
                .select()
                .from(order_status)
                .where(eq(order_status.order_status_name, 'cancelled'))
                .limit(1);

            if (cancelledStatus[0]) {
                await db
                    .update(orders)
                    .set({ 
                        order_status_id: cancelledStatus[0].order_status_id,
                        payment_status: 'cancelled',
                        updated_at: new Date()
                    })
                    .where(eq(orders.order_id, Number(orderId)));
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order cancelled"
        });

    } catch (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json(
            { error: "Failed to cancel order" },
            { status: 500 }
        );
    }
}