// app/lib/query/review/review-data.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SubmitReviewParams {
  product_id: number;
  order_id: number;
  rating: number;
  comment?: string;
}

interface Review {
  review_id: number;
  user_name: string;
  product_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}


async function submitReview(params: SubmitReviewParams) {
  const res = await fetch("/api/reviews/get-review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to submit review");
  }

  return res.json();
}

async function fetchReviews(productId: number): Promise<Review[]> {
  const res = await fetch(`/api/reviews/${productId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const data = await res.json();
  return data.reviews;
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

// ✅ Consolidated into one function
export function useGetReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => fetchReviews(productId),
    enabled: true, // 👈 always fetch, even if no productId
  });
}