"use client";

import { SectionCards } from "./AdminSectionCard";
import { RevenueChart } from "@/components/chart-area-interactive";
import { useRevenueData } from "@/app/lib/query/admin/dashboard/stats-data";
import ProductPerformanceDemo from "./AdminDashboardTable";

export default function AdminDashboardClient(){
    
    const { data: revenueData, isLoading, isError} = useRevenueData();

    return(
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <RevenueChart data={revenueData} />
                    </div>
                     {/* <AdminDashboardTable /> */}
                     <ProductPerformanceDemo />
                </div>
            </div>
        </div>
    )
}