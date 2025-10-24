  
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { products, reviews, user} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
 
  
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{id: string}>}
) {
  try {
    const { id } = await params

    const productId = Number(id);

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
        user_name: user.name,
        product_id: reviews.product_id,
        product_name: products.product_name,
        rating: reviews.rating,
        comment: reviews.comment,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.user_id, user.id))
      .innerJoin(products, eq(reviews.product_id, products.product_id))
      .where(eq(reviews.product_id, productId))
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