import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { orders, order_products, order_status, products, imageKit_productFiles } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
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
        
        const userId = session.user.id;
        const { id } = await params
        const orderId = Number(id);

        if (isNaN(orderId)) {
            return NextResponse.json(
                { error: "Invalid order ID" },
                { status: 400 }
            );
        }

        const [orderData] = await db
            .select({
                order_id: orders.order_id,
                user_id: orders.user_id,
                order_status_id: orders.order_status_id,
                created_at: orders.created_at,
                updated_at: orders.updated_at,
                order_status_name: order_status.order_status_name,
            })
            .from(orders)
            .innerJoin(order_status, eq(orders.order_status_id, order_status.order_status_id))
            .where(
                and(
                    eq(orders.order_id, orderId),
                    eq(orders.user_id, userId)
                )
            )
            .limit(1);

        if (!orderData) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        const orderItems = await db
            .select({
                product_id: order_products.product_id,
                product_name: products.product_name,
                quantity: order_products.quantity,
                price: order_products.price_at_purchase,
                product_image_url: imageKit_productFiles.product_image_url,
            })
            .from(order_products)
            .innerJoin(products, eq(order_products.product_id, products.product_id))
            .leftJoin(
                imageKit_productFiles,
                eq(products.imageKit_productFiles_id, imageKit_productFiles.id)
            )
            .where(eq(order_products.order_id, orderId));

        const itemsWithSubtotal = orderItems.map(item => ({
            ...item,
            price: Number(item.price),
            subtotal: Number(item.price) * item.quantity,
        }));

        const total = itemsWithSubtotal.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        return NextResponse.json({
            success: true,
            order: {
                order_id: orderData.order_id,
                user_id: orderData.user_id,
                order_status_name: orderData.order_status_name,
                created_at: orderData.created_at,
                updated_at: orderData.updated_at,
                total: Number(total.toFixed(2)),
                products: itemsWithSubtotal,
            }
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}