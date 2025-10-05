import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DirectCheckoutItem {
  productId: number;
  quantity: number;
}

interface DirectCheckoutResponse {
  success: boolean;
  message: string;
  order: {
    order_id: number;
    paypal_order_id: string;
    approval_url: string;
    total: number;
    itemCount: number;
    items: Array<{
      product_id: number;
      product_name: string;
      quantity: number;
      price: number;
    }>;
  };
}

async function directCheckout(items: DirectCheckoutItem[]): Promise<DirectCheckoutResponse> {
    const res = await fetch('/api/checkout/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
    })

    const data = await res.json();

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Failed to process checkout");
    }

    return data
}

export function useDirectCheckout(){
    return useMutation({
        mutationFn: directCheckout,
        onSuccess: (data) => {
        sessionStorage.setItem("pending_order_id", data.order.order_id.toString());
        sessionStorage.setItem("paypal_order_id", data.order.paypal_order_id);

        toast.success("Redirecting to PayPal...");

        setTimeout(() => {
            window.location.href = data.order.approval_url;
        }, 500);
        },
        onError: (error: Error) => {
            console.error('Direct checkout error:', error);
        },
    })
}

export function useCheckout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartProductIds: number[]) => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cartProductIds }),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Checkout failed");
            }

            return res.json();
        },
        onSuccess: (data) => {
            if (data.success && data.order.approval_url) {
                // Store order information in sessionStorage
                sessionStorage.setItem("pending_order_id", data.order.order_id);
                sessionStorage.setItem("paypal_order_id", data.order.paypal_order_id);
                
                // Invalidate cart to ensure fresh data after payment
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                
                // Redirect to PayPal
                window.location.href = data.order.approval_url;
            } else {
                throw new Error("No PayPal approval URL received");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to process checkout");
        },
    });
}