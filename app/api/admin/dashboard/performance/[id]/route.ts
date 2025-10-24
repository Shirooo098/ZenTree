import { db } from "@/db/drizzle";
import { order_products, orders, products, reviews, order_status } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await context.params; 
    const productId = parseInt(id); 
    const searchParams = req.nextUrl.searchParams;
    const period = parseInt(searchParams.get("period") || "180");

    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - period);

    // Get monthly performance data - only for completed orders
    const monthlyDataResult = await db.execute(sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', ${orders.created_at}), 'Month') as month,
        COUNT(DISTINCT ${orders.order_id})::integer as orders,
        COALESCE(SUM(${order_products.quantity}), 0)::integer as quantity_sold,
        COALESCE(SUM(${order_products.price_at_purchase} * ${order_products.quantity}), 0)::numeric as revenue
      FROM ${orders}
      INNER JOIN ${order_products} ON ${orders.order_id} = ${order_products.order_id}
      INNER JOIN ${order_status} ON ${orders.order_status_id} = ${order_status.order_status_id}
      WHERE ${order_products.product_id} = ${productId}
        AND ${orders.created_at} >= ${periodDate}
        AND ${order_status.order_status_name} = 'completed'
      GROUP BY DATE_TRUNC('month', ${orders.created_at})
      ORDER BY DATE_TRUNC('month', ${orders.created_at}) ASC
    `);

    // Get product details with overall stats - only for completed orders
    const productDetails = await db
      .select({
        product_id: products.product_id,
        product_name: products.product_name,
        product_category: products.product_category,
        product_price: products.product_price,
        current_stock: products.stock,
        total_orders: sql<number>`COUNT(DISTINCT CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${orders.order_id} END)`,
        total_quantity_sold: sql<number>`COALESCE(SUM(CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${order_products.quantity} ELSE 0 END), 0)`,
        total_revenue: sql<number>`COALESCE(SUM(CASE WHEN ${order_status.order_status_name} = 'completed' THEN ${order_products.price_at_purchase} * ${order_products.quantity} ELSE 0 END), 0)`,
        average_rating: sql<number>`AVG(${reviews.rating})`,
        review_count: sql<number>`COUNT(DISTINCT ${reviews.review_id})`,
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
      .where(eq(products.product_id, productId))
      .groupBy(
        products.product_id,
        products.product_name,
        products.product_category,
        products.product_price,
        products.stock
      );

    if (productDetails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    const trend = await calculateTrend(
      productId,
      Number(productDetails[0].total_revenue)
    );

    // Format monthly data
    const monthlyData = (monthlyDataResult.rows as any[]).map((row) => ({
      month: row.month.trim(),
      orders: Number(row.orders),
      quantity_sold: Number(row.quantity_sold),
      revenue: Number(row.revenue),
    }));

    return NextResponse.json({
      success: true,
      data: {
        product_id: productDetails[0].product_id,
        product_name: productDetails[0].product_name,
        product_category: productDetails[0].product_category,
        product_price: Number(productDetails[0].product_price),
        current_stock: productDetails[0].current_stock,
        total_orders: Number(productDetails[0].total_orders),
        total_quantity_sold: Number(productDetails[0].total_quantity_sold),
        total_revenue: Number(productDetails[0].total_revenue),
        average_rating: productDetails[0].average_rating
          ? Number(productDetails[0].average_rating)
          : null,
        review_count: Number(productDetails[0].review_count),
        performance_trend: trend,
        monthly_data: monthlyData,
      },
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product details",
      },
      { status: 500 }
    );
  }
}

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