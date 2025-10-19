import { headers } from "next/headers"
import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

import data from '../../lib/data.json'
import { SectionCards } from "@/app/ui/admin/dashboard/AdminSectionCard"

export default async function Admin(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) redirect ("/sign-in")
    
    if(session.user.role !== "admin") return <h1>Unauthorized</h1>

    const cardData = [
    {
      title: "Total Products in Stock",
      value: 125,
      trend: "up" as const,
      trendValue: "+8.2%",
      footerTitle: "Trending up this month",
      footerDescription: "Across all categories",
    },
    {
      title: "Low Stock Alerts",
      value: 12,
      trend: "down" as const,
      trendValue: "-3 items",
      footerTitle: "Down from last week",
      footerDescription: "Requires immediate attention",
    },
    {
      title: "Pending Orders",
      value: 34,
      trend: "up" as const,
      trendValue: "+12%",
      footerTitle: "Increased orders today",
      footerDescription: "Awaiting fulfillment",
    },
    {
      title: "Revenue This Month",
      value: "$45,280",
      trend: "up" as const,
      trendValue: "+18.5%",
      footerTitle: "Strong performance increase",
      footerDescription: "From 156 completed orders",
    },
  ]
    
    return(
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards cards={cardData} />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
                    <DataTable data={data} />
                </div>
            </div>
        </div>
    )
}