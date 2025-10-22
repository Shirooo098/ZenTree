"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
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
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Product</DropdownMenuItem>
          <DropdownMenuItem>Export Data</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function AdminDashboardTable({
  data,
  isLoading = false,
}: {
  data: z.infer<typeof schema>[]
  isLoading?: boolean
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "total_orders", desc: true }
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.product_id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
      defaultValue="top-performing"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="top-performing">
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
            <SelectItem value="all-products">All Products</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="top-performing">
            <IconTrendingUp className="mr-2" />
            Top Performing
          </TabsTrigger>
          <TabsTrigger value="least-performing">
            <IconTrendingDown className="mr-2" />
            Least Performing
          </TabsTrigger>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
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
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
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
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
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
      </TabsContent>
      <TabsContent
        value="least-performing"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center">
          <p className="text-muted-foreground">Least performing products will appear here</p>
        </div>
      </TabsContent>
      <TabsContent
        value="all-products"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed flex items-center justify-center">
          <p className="text-muted-foreground">All products overview will appear here</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}

const chartData = [
  { month: "January", orders: 186, revenue: 8000 },
  { month: "February", orders: 305, revenue: 12000 },
  { month: "March", orders: 237, revenue: 9500 },
  { month: "April", orders: 73, revenue: 3200 },
  { month: "May", orders: 209, revenue: 8800 },
  { month: "June", orders: 214, revenue: 9100 },
]

const chartConfig = {
  orders: {
    label: "Orders",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
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
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
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
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Sales trending up by {item.performance_trend === "up" ? "15.2%" : "5.2%"} this month{" "}
                  <IconTrendingUp className="size-4" />
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

// Example usage with sample data
export default function ProductPerformanceDemo() {
  const sampleData: z.infer<typeof schema>[] = [
    {
      product_id: 1,
      product_name: "Japanese Maple Bonsai",
      product_category: "Bonsai Trees",
      total_orders: 145,
      total_quantity_sold: 167,
      total_revenue: 45890.50,
      current_stock: 23,
      average_rating: 4.8,
      performance_trend: "up"
    },
    {
      product_id: 2,
      product_name: "Ceramic Bonsai Pot - Medium",
      product_category: "Pots & Containers",
      total_orders: 98,
      total_quantity_sold: 112,
      total_revenue: 12340.00,
      current_stock: 45,
      average_rating: 4.5,
      performance_trend: "stable"
    },
    {
      product_id: 3,
      product_name: "Bonsai Pruning Shears",
      product_category: "Tools",
      total_orders: 67,
      total_quantity_sold: 73,
      total_revenue: 5475.00,
      current_stock: 8,
      average_rating: 4.9,
      performance_trend: "up"
    },
    {
      product_id: 4,
      product_name: "Succulent Collection",
      product_category: "Succulents",
      total_orders: 34,
      total_quantity_sold: 41,
      total_revenue: 2890.00,
      current_stock: 56,
      average_rating: 4.2,
      performance_trend: "down"
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <AdminDashboardTable data={sampleData} />
    </div>
  )
}