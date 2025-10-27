import { NextResponse } from "next/server";

import { sql, eq, and, gte } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { order_products, orders } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "90");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const revenueData = await db
      .select({
        date: sql<string>`DATE(${orders.created_at})`,
        total: sql<number>`COALESCE(SUM(${order_products.quantity} * ${order_products.price_at_purchase}), 0)`,
      })
      .from(orders)
      .innerJoin(order_products, eq(orders.order_id, order_products.order_id))
      .where(
        and(
          gte(orders.created_at, startDate),
          eq(orders.order_status_id, 4), 
        )
      )
      .groupBy(sql`DATE(${orders.created_at})`)
      .orderBy(sql`DATE(${orders.created_at})`);


    const filledData = fillMissingDates(revenueData, days);

    return NextResponse.json({
      success: true,
      data: filledData,
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}

// Helper function to fill missing dates with 0 revenue
function fillMissingDates(
  data: Array<{ date: string; total: number }>,
  days: number
): Array<{ date: string; total: number }> {
  const result: Array<{ date: string; total: number }> = [];
  const dataMap = new Map(data.map((item) => [item.date, item.total]));

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      total: dataMap.get(dateStr) || 0,
    });
  }

  return result;
}