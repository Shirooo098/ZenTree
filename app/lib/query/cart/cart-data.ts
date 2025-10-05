import { CartProps, CartResponse } from "@/app/types/definition";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function addToCart(productId: number, quantity: number = 1){
    console.log("Sending to API:", { productId, quantity });

    const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity}),
        credentials: 'include',
    })

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Failed to add to cart");
    }

    return res.json();
}


export function useAddToCart(){
    const queryClient = useQueryClient();
    const router = useRouter();


    return useMutation({
        mutationFn: ({ productId, quantity}: { productId: number; quantity: number}) => 
            addToCart(productId, quantity ?? 1),
        
        onSuccess: (data) => {
            toast.success(data.message || "Product added to cart successfully");

            queryClient.invalidateQueries({ queryKey: ["cart"] });
            router.push("/product")
        },

        onError: (error: any) => {
            toast.error(error.message || "Failed to add to cart")
        }
    })
}

async function fetchCart(): Promise<CartProps> {
    const res = await fetch("/api/cart", {
        method: 'GET',
        credentials: 'include'
    });

    if(!res.ok){
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch cart");
    }

    const data: CartResponse = await res.json();
    return data.cart;
}

export function useCart(){
    return useQuery({
        queryKey: ['cart'],
        queryFn: fetchCart,
        staleTime: 1000 * 60 * 5,
        retry: 1

    })
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartProductId: number) => {
            const res = await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartProductId }),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to remove from cart');
            }

            return res.json();
        },
        onSuccess: () => {
            // Invalidate cart query to refetch updated cart
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error) => {
            console.error('Error removing from cart:', error);
        },
    });
}

export function useUpdateCartQuantity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ cartProductId, quantity }: { cartProductId: number; quantity: number }) => {
            const res = await fetch('/api/cart/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartProductId, quantity }),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update quantity');
            }

            return res.json();
        },
        onSuccess: () => {
            // Invalidate cart query to refetch updated cart
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error) => {
            console.error('Error updating cart quantity:', error);
        },
    });
}