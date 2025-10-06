import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Review, SubmitReviewParams } from "@/app/types/definition";

async function submitReview(params: SubmitReviewParams) {
  const res = await fetch(`/api/reviews/add-review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: params.productId,  
      order_id: params.orderId,
      rating: params.rating,
      comment: params.comment,
    }),
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
    onSuccess: (data, variables) => {
      toast.success("Review submitted successfully!");
      // Invalidate reviews for the specific product
      queryClient.invalidateQueries({ 
        queryKey: ["reviews", variables.productId] 
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

export function useGetReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId, // Only fetch when productId exists
  });
}