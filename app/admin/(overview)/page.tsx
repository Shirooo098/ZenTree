import { headers } from "next/headers"
import { auth } from "../../lib/auth"
import { redirect } from "next/navigation"
import AdminDashboardClient from "@/app/ui/admin/dashboard/AdminDashboardClient"

export default async function Admin(){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) redirect ("/sign-in")
    
    if(session.user.role !== "admin") return <h1>Unauthorized</h1>
  
    return <AdminDashboardClient/>
}