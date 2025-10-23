"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLayoutColumns,
  IconLoader,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useProductPerformance, useProductDetail } from "@/app/lib/query/admin/dashboard/table/table-performance-data"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export const schema = z.object({
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

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "product_category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.product_category}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "total_orders",
    header: () => <div className="w-full text-right">Orders</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.total_orders.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "total_quantity_sold",
    header: () => <div className="w-full text-right">Qty Sold</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.original.total_quantity_sold.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "total_revenue",
    header: () => <div className="w-full text-right">Revenue</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ₱{row.original.total_revenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    accessorKey: "current_stock",
    header: () => <div className="w-full text-right">Stock</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge 
          variant={row.original.current_stock < 10 ? "destructive" : "outline"}
          className="px-1.5"
        >
          {row.original.current_stock}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "average_rating",
    header: () => <div className="w-full text-right">Rating</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.average_rating 
          ? `⭐ ${row.original.average_rating.toFixed(1)}`
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "performance_trend",
    header: "Trend",
    cell: ({ row }) => {
      const trend = row.original.performance_trend
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {trend === "up" && (
            <>
              <IconTrendingUp className="text-green-500" />
              Up
            </>
          )}
          {trend === "down" && (
            <>
              <IconTrendingDown className="text-red-500" />
              Down
            </>
          )}
          {trend === "stable" && (
            <>
              <IconCircleCheckFilled className="fill-blue-500" />
              Stable
            </>
          )}
        </Badge>
      )
    },
  },
]

interface DataTableProps {
  limit?: number
  period?: number
}

export function DataTable({ limit = 50, period = 30 }: DataTableProps) {
  const [activeTab, setActiveTab] = React.useState<"top-performing" | "least-performing">("top-performing")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const topQuery = useProductPerformance("top", limit, period)
  const leastQuery = useProductPerformance("least", limit, period)

  const currentQuery = activeTab === "top-performing" ? topQuery : leastQuery
  const data = currentQuery.data || []
  const isLoading = currentQuery.isLoading
  const isError = currentQuery.isError

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.product_id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-performing">Top Performing</SelectItem>
            <SelectItem value="least-performing">Least Performing</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="top-performing">
            <IconTrendingUp className="mr-2" />
            Top Performing
          </TabsTrigger>
          <TabsTrigger value="least-performing">
            <IconTrendingDown className="mr-2" />
            Least Performing
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent
        value="top-performing"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableContent 
          table={table} 
          isLoading={isLoading} 
          isError={isError} 
          columns={columns} 
        />
      </TabsContent>

      <TabsContent
        value="least-performing"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableContent 
          table={table} 
          isLoading={isLoading} 
          isError={isError} 
          columns={columns} 
        />
      </TabsContent>
    </Tabs>
  )
}

function TableContent({ table, isLoading, isError, columns }: any) {
  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <IconLoader className="mx-auto animate-spin" />
                  <p className="mt-2">Loading products...</p>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="text-destructive">Error loading products. Please try again.</p>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="flex w-full items-center gap-8 lg:w-fit lg:ml-auto">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient() 

  const { data: productDetail, isLoading } = useProductDetail(item.product_id, 180, isOpen)


  const chartData = productDetail?.monthly_data || []

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.product_name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.product_name}</DrawerTitle>
          <DrawerDescription>
            Product performance analytics for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm pb-4">
          {!isMobile && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <IconLoader className="animate-spin" />
                </div>
              ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                      left: 0,
                      right: 10,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                      hide
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                      dataKey="orders"
                      type="natural"
                      fill="var(--color-orders)"
                      fillOpacity={0.6}
                      stroke="var(--color-orders)"
                      stackId="a"
                    />
                    <Area
                      dataKey="revenue"
                      type="natural"
                      fill="var(--color-revenue)"
                      fillOpacity={0.4}
                      stroke="var(--color-revenue)"
                      stackId="a"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                  No chart data available
                </div>
              )}
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Sales trending {item.performance_trend === "up" ? "up" : item.performance_trend === "down" ? "down" : "stable"}
                  {item.performance_trend === "up" && <IconTrendingUp className="size-4" />}
                  {item.performance_trend === "down" && <IconTrendingDown className="size-4" />}
                </div>
                <div className="text-muted-foreground">
                  This product has generated ₱{item.total_revenue.toLocaleString()} in revenue 
                  from {item.total_orders} orders with {item.total_quantity_sold} units sold.
                </div>
              </div>
              <Separator />
            </>
          )}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{item.product_category}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Current Stock</Label>
                <p className="font-medium">{item.current_stock}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Total Orders</Label>
                <p className="font-medium">{item.total_orders.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Units Sold</Label>
                <p className="font-medium">{item.total_quantity_sold.toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Total Revenue</Label>
                <p className="font-medium">₱{item.total_revenue.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Avg Rating</Label>
                <p className="font-medium">
                  {item.average_rating ? `⭐ ${item.average_rating.toFixed(1)}` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>View Full Analytics</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function ProductPerformanceTable() {
  return <DataTable limit={50} period={30} />
}   