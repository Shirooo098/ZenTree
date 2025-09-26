import { ProductProps } from "@/app/types/definition";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";


const fetchAllProducts = async () : Promise<Array<ProductProps>> => {
    const response = await fetch('/api/admin/product');
    const result = await response.json();

    return result.productsData as ProductProps[]
}

export const useAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => fetchAllProducts()
    })
}

const fetchProductId = async(productId: number): Promise<ProductProps> => {
    const response = await fetch(`/api/admin/product/${productId}`);

    if(!response) throw new Error(`Product with ${productId} not found.`);

    return response.json();
}


export const useProductId = (
    productId: number,
    options?: Partial<UseQueryOptions<ProductProps, Error>>) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => await fetchProductId(productId),
        enabled: !!productId,
        ...options
    })
}

export const deleteProduct = async(productId: number) => {
    const response = await fetch(`/api/admin/product/${productId}`, {
        method: "DELETE"
    });

    if(!response.ok) throw new Error("Failed to delete product.");

    return response.json();
}