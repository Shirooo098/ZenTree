"use server";

import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { reviews, orders, order_products, order_status, user } from "@/db/schema";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

interface SubmitReviewInput {
  productId: number;
  orderId?: number;
  rating: number;
  comment?: string;
}

interface SubmitReviewResponse {
  success: boolean;
  message: string;
  review?: any;
  error?: string;
}

export async function submitReview(
  data: SubmitReviewInput
): Promise<SubmitReviewResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You must be logged in to submit a review",
      };
    }

    const userId = session.user.id;

    // Validate required fields
    if (!data.productId || !data.rating) {
      return {
        success: false,
        message: "Validation Error",
        error: "Product ID and rating are required",
      };
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return {
        success: false,
        message: "Validation Error",
        error: "Rating must be between 1 and 5",
      };
    }

    // Optional: Validate order and delivery status
    if (data.orderId) {
      const [order] = await db
        .select({
          order_id: orders.order_id,
          order_status_name: order_status.order_status_name,
        })
        .from(orders)
        .innerJoin(
          order_status,
          eq(orders.order_status_id, order_status.order_status_id)
        )
        .where(
          and(eq(orders.order_id, data.orderId), eq(orders.user_id, userId))
        )
        .limit(1);

      if (!order) {
        return {
          success: false,
          message: "Order Not Found",
          error: "Order not found or does not belong to you",
        };
      }

      if (order.order_status_name !== "delivered") {
        return {
          success: false,
          message: "Order Not Delivered",
          error: "You can only review products from delivered orders",
        };
      }

      // Verify product is in the order
      const [orderProduct] = await db
        .select()
        .from(order_products)
        .where(
          and(
            eq(order_products.order_id, data.orderId),
            eq(order_products.product_id, data.productId)
          )
        )
        .limit(1);

      if (!orderProduct) {
        return {
          success: false,
          message: "Product Not In Order",
          error: "This product is not in the specified order",
        };
      }
    }

    // Check for existing review
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.user_id, userId),
          eq(reviews.product_id, data.productId)
        )
      )
      .limit(1);

    if (existingReview) {
      return {
        success: false,
        message: "Duplicate Review",
        error: "You have already reviewed this product",
      };
    }

    // Insert review
    const [insertedReview] = await db
      .insert(reviews)
      .values({
        product_id: data.productId,
        user_id: userId,
        rating: data.rating,
        comment: data.comment || null,
      })
      .returning();

    return {
      success: true,
      message: "Review submitted successfully",
      review: insertedReview,
    };
  } catch (error) {
    console.error("Review submission error:", error);
    return {
      success: false,
      message: "Server Error",
      error: "Failed to submit review. Please try again.",
    };
  }
}

export async function getProductReviews(productId: number) {
  try {
    const productReviews = await db
      .select({
        review_id: reviews.review_id,
        user_id: reviews.user_id,
        user_name: user.name,
        user_image: user.image,
        rating: reviews.rating,
        comment: reviews.comment,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.user_id, user.id))
      .where(eq(reviews.product_id, productId))
      .orderBy(reviews.created_at);

    // Calculate average rating
    const avgRating =
      productReviews.length > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length
        : 0;

    return {
      success: true,
      reviews: productReviews,
      count: productReviews.length,
      averageRating: avgRating,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      reviews: [],
      count: 0,
      averageRating: 0,
      error: "Failed to fetch reviews",
    };
  }
}

export async function getUserReviewForProduct(productId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, review: null };
    }

    const [review] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.user_id, session.user.id),
          eq(reviews.product_id, productId)
        )
      )
      .limit(1);

    return {
      success: true,
      review: review || null,
    };
  } catch (error) {
    console.error("Error fetching user review:", error);
    return {
      success: false,
      review: null,
      error: "Failed to fetch review",
    };
  }
}