import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { TanstackProvider } from "@/context/tanstack-provider";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) redirect("/sign-in")
    if(session.user.role !== "admin") return <h1>Unauthorized</h1>
  
    return (
        <TanstackProvider user={session.user}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <SidebarWrapper user={{
                    id: session.user.id,
                    name: session.user.name,
                    username: session.user.username,
                    email: session.user.email,
                    role: session.user.role
                }}>
                    {children}
                </SidebarWrapper>
            </div>
        </TanstackProvider>
    );
}