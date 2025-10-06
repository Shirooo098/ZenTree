import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { imageKit_productFiles, order_products, order_status, orders, products } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(){
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

        const allOrders = await db
            .select({
                order_id: orders.order_id,
                order_status_name: order_status.order_status_name,
                created_at: orders.created_at,
                updated_at: orders.updated_at
            })
            .from(orders)
            .innerJoin(order_status, eq(orders.order_status_id, order_status.order_status_id))
            .where(eq(orders.user_id, userId))

            console.log("User ID:", userId);
            console.log("Orders found:", allOrders.length);
        
        const ordersWithProducts = await Promise.all(
            allOrders.map(async (order) => {
                const productsInOrder = await db
                .select({
                    product_id: products.product_id,
                    product_name: products.product_name,
                    product_price: products.product_price,
                    quantity: order_products.quantity,
                    price_at_purchase: order_products.price_at_purchase,
                    product_image_url: imageKit_productFiles.product_image_url,
                })
                .from(order_products)
                .innerJoin(products, eq(order_products.product_id, products.product_id))
                .leftJoin(imageKit_productFiles, eq(products.imageKit_productFiles_id, imageKit_productFiles.id))
                .where(eq(order_products.order_id, order.order_id));

                return {
                ...order,
                products: productsInOrder,
                };
            })
        );
        return NextResponse.json({ success: true, orders: ordersWithProducts})
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json(
            { error: "Failed to fetch all orders." },
            { status: 500 }
        )
    }
}