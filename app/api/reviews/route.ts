// app/api/reviews/route.ts
import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { reviews, orders, order_products } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
 
// GET reviews for a specific product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const productReviews = await db
      .select({
        review_id: reviews.review_id,
        user_id: reviews.user_id,
        rating: reviews.rating,
        comment: reviews.comment,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(eq(reviews.product_id, parseInt(productId)))
      .orderBy(reviews.created_at);

    return NextResponse.json({
      success: true,
      reviews: productReviews
    });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}