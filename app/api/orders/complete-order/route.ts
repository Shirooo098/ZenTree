import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { orders, order_status, products, order_products, cart_products, carts } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { capturePayPalOrder } from "@/config/config-paypal";

export async function POST(req: NextRequest) {
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

        const userId = session.user.id

        const { orderId, paypalOrderId } = await req.json();

        // Capture the PayPal payment
        const captureData = await capturePayPalOrder(paypalOrderId);

        if (captureData.status === "COMPLETED") {
            // Update order status to "completed"
            const completedStatus = await db
                .select()
                .from(order_status)
                .where(eq(order_status.order_status_name, 'paid'))
                .limit(1);

            if (completedStatus[0]) {
                await db
                    .update(orders)
                    .set({ 
                        order_status_id: completedStatus[0].order_status_id,
                        updated_at: new Date()
                    })
                    .where(eq(orders.order_id, orderId));
            }

            // Decrement stock for all order items
            const orderItems = await db
                .select()
                .from(order_products)
                .where(eq(order_products.order_id, orderId));

            for (const item of orderItems) {
                const [product] = await db
                    .select()
                    .from(products)
                    .where(eq(products.product_id, item.product_id));

                if (product) {
                    await db
                        .update(products)
                        .set({ stock: product.stock - item.quantity })
                        .where(eq(products.product_id, item.product_id));
                }
            }

            // Remove items from cart (if you stored cart_product_ids)
            const [userCart] = await db
                .select({ cart_id: carts.cart_id })
                .from(carts)
                .where(eq(carts.user_id, userId))
                .limit(1);

            if (userCart) {
                await db
                    .delete(cart_products)
                    .where(eq(cart_products.cart_id, userCart.cart_id));
            }

            return NextResponse.json({
                success: true,
                message: "Payment completed successfully",
                orderId,
                paypalData: captureData
            });
        } else {
            return NextResponse.json(
                { error: "Payment not completed", status: captureData.status },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error completing order:", error);
        return NextResponse.json(
            { error: "Failed to complete order" },
            { status: 500 }
        );
    }
}
