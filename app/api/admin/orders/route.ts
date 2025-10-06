import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { imageKit_productFiles, order_products, order_status, orders, products, user } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
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

    // Check if user is admin
    const [currentUser] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch ALL orders (no user filter)
    const allOrders = await db
      .select({
        order_id: orders.order_id,
        user_id: orders.user_id,
        order_status_name: order_status.order_status_name,
        paypal_order_id: orders.paypal_order_id,
        payment_status: orders.payment_status,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
        user_name: user.name,
        user_email: user.email
      })
      .from(orders)
      .innerJoin(order_status, eq(orders.order_status_id, order_status.order_status_id))
      .innerJoin(user, eq(orders.user_id, user.id))
      .orderBy(
        sql`CASE WHEN ${order_status.order_status_name} = 'paid' THEN 0 ELSE 1 END`,
        desc(orders.created_at)
      );
    console.log("Admin fetching all orders. Total found:", allOrders.length);
    
    // Fetch products for each order
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

        // Calculate total
        const total = productsInOrder.reduce(
          (sum, item) => sum + (item.price_at_purchase * item.quantity), 
          0
        );

        return {
          ...order,
          products: productsInOrder,
          total
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      orders: ordersWithProducts,
      count: ordersWithProducts.length
    });

  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}