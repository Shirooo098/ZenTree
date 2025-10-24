import { headers } from "next/headers"
import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"
import AdminDashboardClient from "@/app/ui/admin/dashboard/AdminDashboardClient"



export default async function Admin(){
    return <AdminDashboardClient/>
}