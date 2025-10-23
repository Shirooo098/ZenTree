import { db } from "@/db/drizzle";
import { order_products, orders, products } from "@/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
try {
    const searchParams = req.nextUrl.searchParams;
    const period = parseInt(searchParams.get("period") || "30");

    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - period);

    // Get overall statistics
    const summary = await db
      .select({
        total_products: sql<number>`COUNT(DISTINCT ${products.product_id})`,
        total_orders: sql<number>`COUNT(DISTINCT ${orders.order_id})`,
        total_revenue: sql<number>`COALESCE(SUM(${order_products.price_at_purchase} * ${order_products.quantity}), 0)`,
        total_units_sold: sql<number>`COALESCE(SUM(${order_products.quantity}), 0)`,
        average_order_value: sql<number>`COALESCE(AVG(${order_products.price_at_purchase} * ${order_products.quantity}), 0)`,
      })
      .from(products)
      .leftJoin(order_products, eq(products.product_id, order_products.product_id))
      .leftJoin(
        orders,
        and(
          eq(order_products.order_id, orders.order_id),
          gte(orders.created_at, periodDate),
          eq(orders.payment_status, "completed")
        )
      );

    // Get top category
    const topCategory = await db
      .select({
        category: products.product_category,
        revenue: sql<number>`SUM(${order_products.price_at_purchase} * ${order_products.quantity})`,
      })
      .from(products)
      .innerJoin(order_products, eq(products.product_id, order_products.product_id))
      .innerJoin(
        orders,
        and(
          eq(order_products.order_id, orders.order_id),
          gte(orders.created_at, periodDate),
          eq(orders.payment_status, "completed")
        )
      )
      .groupBy(products.product_category)
      .orderBy(desc(sql`SUM(${order_products.price_at_purchase} * ${order_products.quantity})`))
      .limit(1);

    // Get low stock products (stock < 10)
    const lowStockCount = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .where(sql`${products.stock} < 10`);

    return NextResponse.json({
      success: true,
      data: {
        ...summary[0],
        top_category: topCategory[0]?.category || "N/A",
        low_stock_products: Number(lowStockCount[0]?.count || 0),
        period_days: period,
      },
    });
  } catch (error) {
    console.error("Error fetching performance summary:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch performance summary",
      },
      { status: 500 }
    );
  }
}