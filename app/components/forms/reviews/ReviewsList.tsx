// app/components/forms/reviews/ReviewsList.tsx
"use client";

import { Leaf } from "lucide-react";
import { useGetReviews } from "@/app/lib/query/review/review-data";

interface ReviewsListProps {
  productId?: number;
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { data: reviews, isLoading, isError } = useGetReviews(productId);

  if (isLoading) return <p>Loading reviews...</p>;
  if (isError) return <p>Failed to load reviews.</p>;
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
        {productId ? `Reviews for Product ${productId}` : "All Reviews"}
      </h3>

      <div className="flex flex-wrap gap-6 justify-center">
        {reviews.map((review: any) => (
          <div
            key={review.review_id}
            className="w-full sm:w-[45%] lg:w-[30%] bg-[#ffffff] border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 "
          >
            <p className="font-semibold text-[#675d50] mb-1">
              {review.user_name || "Anonymous"}
            </p>
            <p className="text-sm text-gray-500 mb-1 italic">
              {review.product_name || "Unknown Product"}
            </p>

            {/* Rating with leaves */}
            <div className="flex justify-center items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Leaf
                  key={i}
                  size={18}
                  className={
                    i < review.rating
                      ? "text-green-600 fill-[#675d50] "
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            {review.comment && (
              <p className="text-gray-800 text-sm mb-2">{review.comment}</p>
            )}

            <p className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
