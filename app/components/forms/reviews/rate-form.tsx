// app/components/forms/rate-form.tsx
"use client";

import { useSubmitReview } from "@/app/lib/query/review/review-data";
import { Leaf } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RateFormProps {
  productId: number;
  orderId: number;
  productName: string;
  onSuccess?: () => void;
}

export default function RateForm({
  productId,
  orderId,
  productName,
  onSuccess,
}: RateFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate: submitReview, isPending } = useSubmitReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    submitReview(
      {
        productId,
        orderId,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Review: {productName}
      </h3>

      {/* Leaf Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((leaf) => (
            <button
              key={leaf}
              type="button"
              onClick={() => setRating(leaf)}
              onMouseEnter={() => setHoveredRating(leaf)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Leaf
                className={`w-8 h-8 ${
                  leaf <= (hoveredRating || rating)
                    ? "fill-[#675d50] text-[#675d50]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {rating} out of 5 leaves
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#675d50] focus:border-transparent resize-none"
          placeholder="Share your thoughts about this product..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={rating === 0 || isPending}
        className="w-full bg-[#675d50] text-white py-3 rounded-lg font-semibold hover:bg-[#594f45] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
