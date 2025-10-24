import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { orders, order_status, products, order_products, cart_products, carts } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
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

        const userId = session.user.id;
        const { orderId, paypalOrderId } = await req.json();

          
        const [order] = await db
            .select()
            .from(orders)
            .where(eq(orders.order_id, orderId))
            .limit(1);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

          
        if (order.user_id !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

          
        const captureData = await capturePayPalOrder(paypalOrderId);

        if (captureData.status === "COMPLETED") {
              
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
                        payment_status: 'completed',
                        updated_at: new Date()
                    })
                    .where(eq(orders.order_id, orderId));
            }

              
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

              
              
            const [userCart] = await db
                .select({ cart_id: carts.cart_id })
                .from(carts)
                .where(eq(carts.user_id, userId))
                .limit(1);

            if (userCart) {
                  
                const productIds = orderItems.map(item => item.product_id);
                
                const matchingCartItems = await db
                    .select({
                        cart_products_id: cart_products.cart_products_id,
                        product_id: cart_products.product_id
                    })
                    .from(cart_products)
                    .where(
                        and(
                            eq(cart_products.cart_id, userCart.cart_id),
                            inArray(cart_products.product_id, productIds)
                        )
                    );

                  
                if (matchingCartItems.length > 0) {
                    const cartProductIdsToRemove = matchingCartItems.map(
                        item => item.cart_products_id
                    );

                    await db
                        .delete(cart_products)
                        .where(inArray(cart_products.cart_products_id, cartProductIdsToRemove));

                    console.log(`Removed ${cartProductIdsToRemove.length} items from cart`);
                } else {
                    console.log("No matching cart items found - likely a direct checkout");
                }
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