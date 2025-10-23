  import { db } from "@/db/drizzle";
  import { order_products, orders, products, reviews } from "@/db/schema";
  import { and, desc, eq, gte, sql } from "drizzle-orm";
  import { NextRequest, NextResponse } from "next/server";


  export async function GET(req: NextRequest) {
    try {
      const searchParams = req.nextUrl.searchParams;
      const period = parseInt(searchParams.get("period") || "30");

      const periodDate = new Date();
      periodDate.setDate(periodDate.getDate() - period);

      const categoryPerformance = await db
        .select({
          category: products.product_category,
          product_count: sql<number>`COUNT(DISTINCT ${products.product_id})`,
          total_orders: sql<number>`COUNT(DISTINCT ${orders.order_id})`,
          total_revenue: sql<number>`COALESCE(SUM(${order_products.price_at_purchase} * ${order_products.quantity}), 0)`,
          total_units_sold: sql<number>`COALESCE(SUM(${order_products.quantity}), 0)`,
          average_rating: sql<number>`AVG(${reviews.rating})`,
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
        )
        .leftJoin(reviews, eq(products.product_id, reviews.product_id))
        .groupBy(products.product_category)
        .orderBy(desc(sql`COALESCE(SUM(${order_products.price_at_purchase} * ${order_products.quantity}), 0)`));

      return NextResponse.json({
        success: true,
        data: categoryPerformance.map((cat) => ({
          ...cat,
          total_revenue: Number(cat.total_revenue),
          total_orders: Number(cat.total_orders),
          total_units_sold: Number(cat.total_units_sold),
          average_rating: cat.average_rating ? Number(cat.average_rating) : null,
        })),
        metadata: {
          period: `${period} days`,
          count: categoryPerformance.length,
        },
      });
    } catch (error) {
      console.error("Error fetching category performance:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch category performance",
        },
        { status: 500 }
      );
    }
  }