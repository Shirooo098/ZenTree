import { AdminOrder } from "@/app/types/definition";
import { useQuery } from "@tanstack/react-query";


async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch("/api/admin/orders", {
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("Admin access required");
    }
    throw new Error("Failed to fetch orders");
  }

  const data = await res.json();
  return data.orders;
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchAdminOrders,
    staleTime: 30000, 
    refetchOnWindowFocus: true, 
  });
}