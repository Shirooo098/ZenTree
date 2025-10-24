  
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export async function fetchRefunds() {
  const response = await fetch("/api/admin/refund");
  
  if (!response.ok) {
    throw new Error("Failed to fetch refunds");
  }
  
  return response.json();
}

  
export function useRefunds() {
  return useQuery({
    queryKey: ["refunds"],
    queryFn: fetchRefunds,
  });
}

  
export function useUpdateRefundStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      refundId,
      status,
      admin_notes,
      item_conditions,
    }: {
      refundId: number;
      status: string;
      admin_notes?: string;
      item_conditions?: Record<number, string>;
    }) => {
      const response = await fetch(`/api/admin/refund/${refundId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          admin_notes,
          item_conditions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update refund status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    },
  });
}