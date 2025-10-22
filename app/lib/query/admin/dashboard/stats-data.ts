"use client"

import { useQuery } from "@tanstack/react-query"

interface RevenueData {
  date: string;
  total: number;
}

interface RevenueResponse {
  success: boolean;
  data: RevenueData[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard/stats", {
        method: "GET",
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats")
      }
      return res.json()
    },

    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  })
}

async function fetchRevenueData(days: number = 90): Promise<RevenueData[]> {
  const response = await fetch(`/api/admin/dashboard/revenue?days=${days}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch revenue data');
  }
  
  const result: RevenueResponse = await response.json();
  
  if (!result.success) {
    throw new Error('Revenue data fetch was not successful');
  }
  
  return result.data;
}

export function useRevenueData(){
  return useQuery({
    queryKey: ['revenue', 90],
    queryFn: () => fetchRevenueData(90),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}