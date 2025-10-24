"use client"

import { useQuery } from "@tanstack/react-query"
import { z } from "zod"

  
export const productPerformanceSchema = z.object({
  product_id: z.number(),
  product_name: z.string(),
  product_category: z.string(),
  total_orders: z.number(),
  total_quantity_sold: z.number(),
  total_revenue: z.number(),
  current_stock: z.number(),
  average_rating: z.number().nullable(),
  performance_trend: z.enum(["up", "down", "stable"]),
})

export type ProductPerformance = z.infer<typeof productPerformanceSchema>

interface ProductPerformanceResponse {
  success: boolean
  data: ProductPerformance[]
  metadata: {
    type: string
    period: string
    limit: number
    count: number
  }
}

  
async function fetchProductPerformance(
  type: "top" | "least",
  limit: number = 10,
  period: number = 30
): Promise<ProductPerformance[]> {
  const response = await fetch(
    `/api/admin/dashboard/performance?type=${type}&limit=${limit}&period=${period}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch product performance")
  }

  const result: ProductPerformanceResponse = await response.json()

  if (!result.success) {
    throw new Error("Product performance fetch was not successful")
  }

  return result.data
}

  
export function useProductPerformance(
  type: "top" | "least",
  limit: number = 10,
  period: number = 30
) {
  return useQuery({
    queryKey: ["product-performance", type, limit, period],
    queryFn: () => fetchProductPerformance(type, limit, period),
    staleTime: 5 * 60 * 1000,   
    refetchOnWindowFocus: false,
  })
}

  
interface PerformanceSummaryData {
  total_products: number
  total_orders: number
  total_revenue: number
  total_units_sold: number
  average_order_value: number
  top_category: string
  low_stock_products: number
  period_days: number
}

interface PerformanceSummaryResponse {
  success: boolean
  data: PerformanceSummaryData
}

  
async function fetchPerformanceSummary(
  period: number = 30
): Promise<PerformanceSummaryData> {
  const response = await fetch(
    `/api/admin/dashboard/performance/summary?period=${period}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch performance summary")
  }

  const result: PerformanceSummaryResponse = await response.json()

  if (!result.success) {
    throw new Error("Performance summary fetch was not successful")
  }

  return result.data
}

  
export function usePerformanceSummary(period: number = 30) {
  return useQuery({
    queryKey: ["performance-summary", period],
    queryFn: () => fetchPerformanceSummary(period),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

  
interface CategoryPerformance {
  category: string
  product_count: number
  total_orders: number
  total_revenue: number
  total_units_sold: number
  average_rating: number | null
}

interface CategoryPerformanceResponse {
  success: boolean
  data: CategoryPerformance[]
  metadata: {
    period: string
    count: number
  }
}

  
async function fetchCategoryPerformance(
  period: number = 30
): Promise<CategoryPerformance[]> {
  const response = await fetch(
    `/api/admin/dashboard/performance/categories?period=${period}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch category performance")
  }

  const result: CategoryPerformanceResponse = await response.json()

  if (!result.success) {
    throw new Error("Category performance fetch was not successful")
  }

  return result.data
}

  
export function useCategoryPerformance(period: number = 30) {
  return useQuery({
    queryKey: ["category-performance", period],
    queryFn: () => fetchCategoryPerformance(period),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

  
interface ProductDetailData extends ProductPerformance {
  product_price: number
  review_count: number
  monthly_data: Array<{
    month: string
    orders: number
    quantity_sold: number
    revenue: number
  }>
}

interface ProductDetailResponse {
  success: boolean
  data: ProductDetailData
}

  
async function fetchProductDetail(
  productId: number,
  period: number = 180
): Promise<ProductDetailData> {
  const response = await fetch(
    `/api/admin/dashboard/performance/${productId}?period=${period}`,
    {
      method: "GET",
      credentials: "include",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch product details")
  }

  const result: ProductDetailResponse = await response.json()

  if (!result.success) {
    throw new Error("Product detail fetch was not successful")
  }

  return result.data
}

  
export function useProductDetail(
    productId: number,
    period: number = 180,
    enabled: boolean
) {
  return useQuery({
    queryKey: ["product-detail", productId, period],
    queryFn: () => fetchProductDetail(productId, period),
    staleTime: 30 * 60 * 1000,   
    gcTime: 60 * 60 * 1000,   
    refetchOnWindowFocus: false,
    refetchOnMount: false,   
    refetchOnReconnect: false,
    enabled: enabled && !!productId,
  })
}