import { ProductProps } from "@/app/types/definition";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const fetchAllProducts = async (urlPath: string) : Promise<Array<ProductProps>> => {
    const response = await fetch(`${urlPath}/product`);
    const result = await response.json();

    console.log("Products Data", result)
    return result.productsData as ProductProps[]
}

export const useAllProducts = (urlPath: "/api/user" | "/api/admin") => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => fetchAllProducts(urlPath)
    })
}


const fetchAdminProductId = async(productId: number): Promise<ProductProps> => {
    const response = await fetch(`/api/admin/product/${productId}`);

    if(!response) throw new Error(`Product with ${productId} not found.`);


    return response.json();
}


const fetchUserProductId = async(productId: number): Promise<ProductProps> => {
    const response = await fetch(`/api/user/product/${productId}`);

    if(!response) throw new Error(`Product with ${productId} not found.`);
    const result = await response.json();
    return result.productsData[0] as ProductProps;
}

export const useAdminProductId = (
    productId: number,
    options?: Partial<UseQueryOptions<ProductProps, Error>>) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => await fetchAdminProductId(productId),
        enabled: !!productId,
        ...options
    })
}


export const useUserProductId = (
    productId: number,
    options?: Partial<UseQueryOptions<ProductProps, Error>>) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => await fetchUserProductId(productId),
        enabled: !!productId,
        ...options
    })
}
