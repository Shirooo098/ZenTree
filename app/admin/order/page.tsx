"use client";

import { useAdminOrders } from "@/app/lib/query/admin/orders/order-data";
import OrdersTable from "@/app/ui/admin/order/orderTable";
import { DMSans, ManRope } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/components/ui/skeleton/skeleton";
import { Suspense } from "react";

export default function Page(){
    const { data: orders, error } = useAdminOrders();

    if(error) return <div>Error Loading Admin Orders</div>
    return(
        <div className={`${ManRope.className}`}>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
                        Orders
                    </h3>
                    <span className="mt-2 text-muted-foreground">
                        A list of orders where you can manage the status of the order.
                    </span>
                </div>
            </div>


            {orders && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg h-fit">
                    <span className="text-sm font-medium text-green-900">
                    Total Orders:
                    </span>
                    <span className="text-lg font-bold text-green-700">
                    {orders.length}
                    </span>
                </div>
            )}

            {/* <Suspense fallback={<InvoicesTableSkeleton/>}>
                <ProductsTable bonsaiProductsData={data ?? []}/>
            </Suspense> */}
        
            <Suspense fallback={<InvoicesTableSkeleton/>}>
                <OrdersTable ordersData={orders ?? []}/>
            </Suspense>
        </div>
    )
}