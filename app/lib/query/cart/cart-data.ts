import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function addToCart(productId: number, quantity: number = 1){
    const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity})
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