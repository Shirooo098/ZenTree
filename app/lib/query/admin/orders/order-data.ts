import { AdminOrder } from "@/app/types/definition";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


interface UpdateOrderStatusParams {
  orderId: number;
  status: string;
}

interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  order_id: number;
  new_status: string;
  payment_status: string;
}

async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/admin/orders", {
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error("Failed to fetch orders");
  }

  const data = await res.json();
  return data.orders;
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAdminOrders,
    staleTime: 30000, 
    refetchOnWindowFocus: true, 
  });
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateOrderStatusResponse, Error, UpdateOrderStatusParams>({
    mutationFn: async ({ orderId, status }) => {
      console.log(`Attempting to update order ${orderId} to status: ${status}`);
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(`Order status updated to ${data.new_status}`);
      console.log(`Order ${data.order_id} updated:`, data);
      
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
      toast.error(error.message || "An error occurred while updating order status");
    },
  });
};