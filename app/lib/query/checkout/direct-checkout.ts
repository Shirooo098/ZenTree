import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DirectCheckoutItem{
    productId: number;
    quantity: number;
}

interface CheckoutResponse{
    success: boolean;
    message: string; 
    order: {
        order_id: number;
        total: number;
        itemCount: number;
        items: {
            product_id: number;
            product_name: string;
            quantity: number;
            price: number;
            subtotal: number;
        }[]
    }
}

async function directCheckout(items: DirectCheckoutItem[]): Promise<CheckoutResponse> {
    const res = await fetch('/api/checkout/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
        credentials: 'include',
    })

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Failed to process checkout");
    }

    return res.json()
}

export function useDirectCheckout(){
    const router = useRouter()

    return useMutation({
        mutationFn: directCheckout,
        onSuccess: (data) => {
            router.push(`/profile/order/${data.order.order_id}`);
        },
        onError: (error: Error) => {
            console.error('Direct checkout error:', error);
        },
    })
}