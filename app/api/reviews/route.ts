import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";          // drizzle connection
import { review } from "@/lib/db/schema"; // your drizzle schema
import type { NewReview } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // type-safe insert (using schema inference)
    const newReview: NewReview = {
      product_id: body.productId,
      user_id: body.userId,         // from auth/session (hardcode for now)
      product_rating: body.productRating,
      review_text: body.review,
    };

    const [inserted] = await db.insert(review).values(newReview).returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
