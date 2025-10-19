"use client"

import { useQuery } from "@tanstack/react-query"

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

