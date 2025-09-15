import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

 
export default async function Layout({ children }: { children: React.ReactNode }) {

      const session = await auth.api.getSession({
          headers: await headers()
      })
      if(!session) redirect ("/sign-in")
      
      if(session.user.role !== "admin") return <h1>Unauthorized</h1>
  
      
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <SidebarProvider
            style={
                {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset"
                user={{
                    id: session.user.id,
                    name: session.user.name,
                    username: session.user.username,
                    email: session.user.email,
                    role: session.user.role
                }} />
            <SidebarInset>
              <SiteHeader />
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    </div>
  );
}

