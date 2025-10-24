import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { order_products, orders, reviews } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { eq,and } from "drizzle-orm";

export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const { product_id, order_id, rating, comment } = body;

      
    if (!product_id || !order_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

      
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

      
    const [orderItem] = await db
      .select({
        order_id: orders.order_id,
        product_id: order_products.product_id,
      })
      .from(orders)
      .innerJoin(order_products, eq(orders.order_id, order_products.order_id))
      .where(
        and(
          eq(orders.order_id, order_id),
          eq(orders.user_id, userId),
          eq(order_products.product_id, product_id)
        )
      )
      .limit(1);

    if (!orderItem) {
      return NextResponse.json(
        { error: "Order not found or does not contain this product" },
        { status: 404 }
      );
    }

      
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.user_id, userId),
          eq(reviews.product_id, product_id)
        )
      )
      .limit(1);

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

      
    const [newReview] = await db
      .insert(reviews)
      .values({
        user_id: userId,
        product_id: product_id,
        rating: rating,
        comment: comment || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully"
    });

  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}