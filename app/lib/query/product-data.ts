import { ProductProps } from "@/app/types/definition";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const fetchAllProducts = async (urlPath: string) : Promise<Array<ProductProps>> => {
    const response = await fetch(`${urlPath}/product`);
    const result = await response.json();

    return result.productsData as ProductProps[]
}

export const useAllProducts = (urlPath: "/api/user" | "/api/admin") => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => fetchAllProducts(urlPath)
    })
}

const fetchProductId = async(urlPath: string, productId: number): Promise<ProductProps> => {
    const response = await fetch(`${urlPath}/product/${productId}`);

    if(!response) throw new Error(`Product with ${productId} not found.`);

    return response.json();
}


export const useProductId = (
    urlPath: "/api/user" | "/api/admin",
    productId: number,
    options?: Partial<UseQueryOptions<ProductProps, Error>>) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => await fetchProductId(urlPath, productId),
        enabled: !!productId,
        ...options
    })
}