import { Order } from "@/app/types/definition";
import { useQuery } from "@tanstack/react-query";

async function fetchOrder(orderId: number): Promise<Order>{
    const res = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include'
    })

    if(!res.ok) throw new Error('Failed to fetch order')

    const data = await res.json();
    return data.order;
}

export function useOrder(orderId: number){
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrder(orderId),
        enabled: !!orderId
    })
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