import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
      subtotal: number;
    }>;
  };
}

async function directCheckout(items: DirectCheckoutItem[]): Promise<DirectCheckoutResponse> {
    const res = await fetch('/api/checkout/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to process checkout");
    }

    return res.json();
}

export function useDirectCheckout() {
    const router = useRouter()
    return useMutation({
        mutationFn: directCheckout,
        onSuccess: (data) => {
              
            sessionStorage.setItem("pending_order_id", data.order.order_id.toString());
            sessionStorage.setItem("paypal_order_id", data.order.paypal_order_id);

            toast.success("Redirecting to PayPal...");

              
            setTimeout(() => {
                router.push(data.order.approval_url)
            }, 500);
        },
        onError: (error: Error) => {
            console.error('Direct checkout error:', error);
            toast.error(error.message || "Failed to process checkout");
        },
    });
}

export function useCheckout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (checkoutItems: Array<{ cartProductId: number; quantity: number }>) => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    checkoutItems: checkoutItems    
                }),
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
                  
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem("pending_order_id", data.order.order_id.toString());
                    sessionStorage.setItem("paypal_order_id", data.order.paypal_order_id);
                      
                    sessionStorage.setItem("checkout_cart_ids", JSON.stringify(data.order.cart_product_ids));
                }
                
                  
                  
                
                toast.success("Redirecting to PayPal...");
                
                  
                setTimeout(() => {
                    window.location.href = data.order.approval_url;
                }, 500);
            } else {
                throw new Error("No PayPal approval URL received");
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to process checkout");
        },
    });
}