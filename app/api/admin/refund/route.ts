// app/api/refunds/route.ts
import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { refund, refund_items, user, products, order_products } from "@/db/schema";
import { getCurrentUser } from "@/server/users";
import { eq, desc, and } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getCurrentUser();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "staff") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Staff access required" },
        { status: 403 }
      );
    }


    // Fetch all refunds
    const refunds = await db
      .select({
        refund_id: refund.refund_id,
        order_id: refund.order_id,
        user_id: refund.user_id,
        email: refund.email,
        reason: refund.reason,
        refund_type: refund.refund_type,
        status: refund.status,
        comments: refund.comments,
        admin_notes: refund.admin_notes,
        created_at: refund.created_at,
        updated_at: refund.updated_at,
        user_name: user.name,
      })
      .from(refund)
      .leftJoin(user, eq(refund.user_id, user.id))
      .orderBy(desc(refund.created_at));

    // Fetch items for each refund
    const refundsWithItems = await Promise.all(
      refunds.map(async (refundRecord) => {
        const items = await db
          .select({
            refund_item_id: refund_items.refund_item_id,
            product_id: refund_items.product_id,
            product_name: products.product_name,
            quantity: refund_items.quantity,
            price_at_purchase: order_products.price_at_purchase,
            condition: refund_items.condition,
            restocked: refund_items.restocked,
          })
          .from(refund_items)
          .leftJoin(products, eq(refund_items.product_id, products.product_id))
          .leftJoin(
            order_products,
            and(
              eq(order_products.order_id, refundRecord.order_id),
              eq(order_products.product_id, refund_items.product_id)
            )
          )
          .where(eq(refund_items.refund_id, refundRecord.refund_id));

        return {
          ...refundRecord,
          refund_items: items,
        };
      })
    );

    return NextResponse.json(refundsWithItems);
  } catch (error) {
    console.error("Error fetching refunds:", error);
    return NextResponse.json(
      { error: "Failed to fetch refunds" },
      { status: 500 }
    );
  }
}