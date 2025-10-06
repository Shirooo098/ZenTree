import { Order } from "@/app/types/definition";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
interface CompleteOrderParams {
  orderId: number;
  paypalOrderId: string;
}

interface CompleteOrderResponse {
  success: boolean;
  orderId: number;
  message?: string;
}

async function fetchOrder(orderId: number): Promise<Order> {
  console.log("Fetching order:", orderId);
  
  const res = await fetch(`/api/orders/${orderId}`, {
    credentials: 'include'
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    throw new Error(`Failed to fetch order: ${res.status}`);
  }

  const data = await res.json();
  console.log("Order data from API:", data);
  return data.order;
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId), 
    enabled: !!orderId
  });
}

const fetchAllOrders = async (): Promise<Array<Order>> => {
    const res = await fetch('/api/orders',{
        credentials: "include"
    })

    if (!res.ok) throw new Error("Failed to fetch orders");

    const data = await res.json();
    return data.orders
}

export function useAllOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchAllOrders
  });
}

async function completeOrder({ orderId, paypalOrderId }: CompleteOrderParams): Promise<CompleteOrderResponse> {
  const res = await fetch("/api/orders/complete-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, paypalOrderId }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to complete payment");
  }

  return res.json();
}

async function cancelOrder(orderId: string): Promise<void> {
  const res = await fetch(`/api/orders/cancel-order?order_id=${orderId}`, {
    method: "GET",
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to cancel order");
  }

  return res.json();
}

export function useCompleteOrder() {
  return useMutation({
    mutationFn: completeOrder,
    onSuccess: () => {
      sessionStorage.removeItem("pending_order_id");
      sessionStorage.removeItem("paypal_order_id");
      
      toast.success("Payment completed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete payment");
    },
  });
}

export function useCancelOrder() {
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      sessionStorage.removeItem("pending_order_id");
      sessionStorage.removeItem("paypal_order_id");
    },
    onError: (error: any) => {
      console.error("Error cancelling order:", error);
    },
  });
}