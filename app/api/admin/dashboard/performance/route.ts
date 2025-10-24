import { db } from "@/db/drizzle";
import { products, order_products, orders, reviews, order_status } from "@/db/schema";
import { sql, eq, and, gte, desc, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function calculateTrend(productId: number, currentRevenue: number) {
  const previousPeriodStart = new Date();
  previousPeriodStart.setDate(previousPeriodStart.getDate() - 60);
  const previousPeriodEnd = new Date();
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 30);

  const previousRevenue = await db
    .select({
      revenue: sql<number>`COALESCE(SUM(${order_products.price_at_purchase} * ${order_products.quantity}), 0)`,
    })
    .from(order_products)
    .innerJoin(orders, eq(order_products.order_id, orders.order_id))
    .innerJoin(order_status, eq(orders.order_status_id, order_status.order_status_id))
    .where(
      and(
        eq(order_products.product_id, productId),
        gte(orders.created_at, previousPeriodStart),
        sql`${orders.created_at} < ${previousPeriodEnd}`,
        eq(order_status.order_status_name, "completed")
      )
    );

  const prevRev = previousRevenue[0]?.revenue || 0;

  if (prevRev === 0 && currentRevenue > 0) return "up";
  if (prevRev === 0 && currentRevenue === 0) return "stable";

  const changePercent = ((currentRevenue - prevRev) / prevRev) * 100;

  if (changePercent >= 10) return "up";
  if (changePercent <= -10) return "down";
  return "stable";
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "top"; 
    const limit = parseInt(searchParams.get("limit") || "10");
    const period = parseInt(searchParams.get("period") || "30");

    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - period);

      
    const performanceData = await db
      .select({
        product_id: products.product_id,
        product_name: products.product_name,
        product_category: products.product_category,
        current_stock: products.stock,
        total_orders: sql<number>`COUNT(DISTINCT CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${orders.order_id} END)`,
        total_quantity_sold: sql<number>`COALESCE(SUM(CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${order_products.quantity} ELSE 0 END), 0)`,
        total_revenue: sql<number>`COALESCE(SUM(CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${order_products.price_at_purchase} * ${order_products.quantity} ELSE 0 END), 0)`,
        average_rating: sql<number>`AVG(${reviews.rating})`,
      })
      .from(products)
      .leftJoin(order_products, eq(products.product_id, order_products.product_id))
      .leftJoin(
        orders,
        and(
          eq(order_products.order_id, orders.order_id),
          gte(orders.created_at, periodDate)
        )
      )
      .leftJoin(order_status, eq(orders.order_status_id, order_status.order_status_id))
      .leftJoin(reviews, eq(products.product_id, reviews.product_id))
      .groupBy(
        products.product_id,
        products.product_name,
        products.product_category,
        products.stock
      );

      
    const productsWithTrends = await Promise.all(
      performanceData.map(async (product) => {
        const trend = await calculateTrend(
          product.product_id,
          Number(product.total_revenue)
        );

        return {
          product_id: product.product_id,
          product_name: product.product_name,
          product_category: product.product_category,
          current_stock: product.current_stock,
          total_orders: Number(product.total_orders),
          total_quantity_sold: Number(product.total_quantity_sold),
          total_revenue: Number(product.total_revenue),
          average_rating: product.average_rating 
            ? Number(product.average_rating) 
            : null,
          performance_trend: trend,
        };
      })
    );

      
    const sortedProducts = productsWithTrends.sort((a, b) => {
      if (type === "top") {
        return b.total_revenue - a.total_revenue;
      } else {
        return a.total_revenue - b.total_revenue;
      }
    });

      
    const limitedProducts = sortedProducts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedProducts,
      metadata: {
        type,
        period: `${period} days`,
        limit,
        count: limitedProducts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching product performance:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product performance data",
      },
      { status: 500 }
    );
  }
}