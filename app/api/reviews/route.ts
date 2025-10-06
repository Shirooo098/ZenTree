import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { reviews } from "@/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


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

    if (!body.productId || !body.productRating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.productRating < 1 || body.productRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const reviewData = {
      product_id: Number(body.productId),
      user_id: Number(userId),        
      rating: body.productRating,
      comment: body.review || null,
    };

    const [inserted] = await db.insert(reviews).values(reviewData).returning();

    if(!inserted) {
      return NextResponse.json(
        { error: "Review does not exist" },
        { status: 400 }
      )
    }

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
