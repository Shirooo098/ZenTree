import { NextResponse } from "next/server"
import { count, sum, gte, lte, lt, gt, and, eq, inArray } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { order_products, order_status, orders, products } from "@/db/schema"
import { getCurrentUser } from "@/server/users"

export async function GET(){
    try {
        const dates = getDateRanges();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - No session" }, 
                { status: 401 }
            )
        }
        
        if (user.role !== "admin" && user.role !== "staff") {
            return NextResponse.json(
                { error: "Unauthorized - Admin or Staff access required" }, 
                { status: 403 }
            )
        }
        
        const [
            productsData, 
            lowStockData, 
            pendingOrdersData, 
            revenueData
        ] = await Promise.all([
            getProductsInStock(dates.startOfLastMonth),
            getLowStockAlerts(dates.oneWeekAgo),
            getPendingOrders(dates.yesterday),
            getMonthlyRevenue(
                dates.startOfMonth,
                dates.startOfLastMonth,
                dates.endOfLastMonth
            )
        ])


        const cards = [
            buildProductsCard(productsData.current, productsData.lastMonth),
            buildLowStockCard(lowStockData.current, lowStockData.lastWeek),
            buildPendingOrdersCard(pendingOrdersData.current, pendingOrdersData.yesterday),
            buildRevenueCard(
                revenueData.current,
                revenueData.lastMonth,
                revenueData.orderCount
            )
        ]

        console.log({cards})
        return NextResponse.json({ cards })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json(
            { error: "Failed to fetch stats" }, 
            { status: 500 }
        )
    }
}

const getDateRanges = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    yesterday.setHours(0, 0, 0, 0);

    return {
        startOfMonth,
        startOfLastMonth,
        endOfLastMonth,
        oneWeekAgo,
        yesterday,
    };
};

const REORDER_THRESHOLD = 10;

const getProductsInStock = async (startOfMonth: Date) => {
    const [current] = await db
        .select({ count: count()})
        .from(products)
        .where(gt(products.stock, 0))

    const [lastMonth] = await db
        .select({ count: count()})
        .from(products)
        .where(and(
            gt(products.stock, 0),
            lt(products.created_at, startOfMonth)
        ))

    return {
        current: current.count,
        lastMonth: lastMonth.count,
    }
}

const getLowStockAlerts = async (oneWeekAgo: Date) => {
    const [current] = await db
        .select({ count: count() })
        .from(products)
        .where(and(
            lt(products.stock, REORDER_THRESHOLD),
            gt(products.stock, 0)
        ))

    const [lastWeek] = await db
        .select({ count: count()})
        .from(products)
        .where(and(
            lt(products.stock, REORDER_THRESHOLD),
            gt(products.stock, 0),
            lt(products.updated_at, oneWeekAgo)
        ))

    return {
        current: current.count,
        lastWeek: lastWeek.count
    }
}

const getPendingOrders = async (yesterday: Date) => {
    const pendingStatus = await db
        .select()
        .from(order_status)
        .where(inArray(order_status.order_status_id, [1, 2]))

    const statusIds = pendingStatus.map(currStatus => currStatus.order_status_id)

    const [current] = await db
        .select({ count: count() })
        .from(orders)
        .where(inArray(orders.order_status_id, statusIds));

    const [yesterdayResults] = await db
        .select({ count: count() })
        .from(orders)
        .where(and(
            inArray(orders.order_status_id, statusIds),
            lt(orders.created_at, yesterday)
        ))

    return {
        current: current.count,
        yesterday: yesterdayResults.count
    }
}

const getMonthlyRevenue = async (
    startOfMonth: Date,
    startOfLastMonth: Date,
    endOfLastMonth: Date
) => {
    const [completedStatus] = await db
        .select()
        .from(order_status)
        .where(eq(order_status.order_status_name, "completed"))
        .limit(1)

    if(!completedStatus){
        return { 
            current: 0,
            lastMonth: 0,
            orderCount: 0
        }
    }

    const [currentMonth] = await db
        .select({
        total: sum(order_products.price_at_purchase),
        count: count(),
        })
        .from(orders)
        .innerJoin(order_products, eq(orders.order_id, order_products.order_id))
        .where(and(
        eq(orders.order_status_id, completedStatus.order_status_id),
        gte(orders.created_at, startOfMonth)
        ))

    const [lastMonth] = await db
        .select({
        total: sum(order_products.price_at_purchase),
        })
        .from(orders)
        .innerJoin(order_products, eq(orders.order_id, order_products.order_id))
        .where(and(
        eq(orders.order_status_id, completedStatus.order_status_id),
        gte(orders.created_at, startOfLastMonth),
        lte(orders.created_at, endOfLastMonth)
        ))

    return {
        current: Number(currentMonth?.total || 0),
        lastMonth: Number(lastMonth?.total || 0),
        orderCount: currentMonth?.count || 0,
    }
}

const buildProductsCard = (current: number, lastMonth: number) => {
    const difference = current - lastMonth;
    const trendPercent = lastMonth > 0 
        ? ((difference / lastMonth) * 100).toFixed(1)
        : current > 0 ? "100" : "0";

    return {
        title: "Total Products in Stock",
        value: current,
        trend: difference >= 0 ? "up" as const : "down" as const,
        trendValue: `${difference >= 0 ? '+': ''}${trendPercent}`,
        footerTitle: difference >= 0
            ? "Growing Inventory this month"
            : "Inventory decreased this month",
        footerDescription: "Across all categories"
    }
}

const buildLowStockCard = (current: number, lastWeek: number) => {
  const difference = lastWeek - current 
  const improved = current < lastWeek

  return {
    title: "Low Stock Alerts",
    value: current,
    trend: improved ? "up" as const : "down" as const,
    trendValue: current === 0 
      ? "All stocked!" 
      : `${Math.abs(difference)} ${difference >= 0 ? 'fewer' : 'more'} items`,
    footerTitle: current === 0 
      ? "No items need restocking" 
      : improved 
        ? "Improved from last week" 
        : "Increased from last week",
    footerDescription: current === 0 
      ? "Inventory levels are healthy" 
      : current < 5 
        ? "Manageable stock levels"
        : "Requires immediate attention",
  }
}

const buildPendingOrdersCard = (current: number, yesterday: number) => {
    const difference = current - yesterday
    const trendPercent = yesterday > 0
        ? ((Math.abs(difference) / yesterday) * 100).toFixed(1)
        : current > 0 ? "100" : "0"

    return {
        title: "Pending Orders",
        value: current,
        trend: difference >= 0 ? "up" as const : "down" as const,
        trendValue: `${difference >= 0 ? '+' : ''}${trendPercent}%`,
        footerTitle: difference >= 0 
        ? "Increased orders today" 
        : "Fewer pending orders",
        footerDescription: current > 20 
        ? "High volume - prioritize fulfillment"
        : "Normal order flow",
    }
}


const buildRevenueCard = (
  current: number,
  lastMonth: number,
  orderCount: number
) => {
    const difference = current - lastMonth
    const trendPercent = lastMonth > 0
        ? ((difference / lastMonth) * 100).toFixed(1)
        : current > 0 ? "100" : "0"

    return {
        title: "Revenue This Month",
        value: `₱${current.toLocaleString('en-PH', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })}`,
        trend: difference >= 0 ? "up" as const : "down" as const,
        trendValue: `${difference >= 0 ? '+' : ''}${trendPercent}%`,
        footerTitle: difference >= 0 
            ? "Strong performance increase" 
            : "Revenue decreased from last month",
        footerDescription: `From ${orderCount} completed orders`,
    }
}