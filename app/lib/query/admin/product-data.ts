import { ProductProps } from "@/app/types/definition";
import { useQuery } from "@tanstack/react-query";

const fetchAllProducts = async () : Promise<Array<ProductProps>> => {
    const response = await fetch('/api/product');
    const result = await response.json();

    return result.productsData as ProductProps[]
}

export const useAllProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: () => fetchAllProducts()
    })
}

