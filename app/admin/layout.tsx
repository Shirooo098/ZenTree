import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { TanstackProvider } from "@/context/tanstack-provider";
import { getCurrentUser } from "@/server/users";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
  
    return (
        <TanstackProvider user={user}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <SidebarWrapper user={user}>
                    {children}
                </SidebarWrapper>
            </div>
        </TanstackProvider>
    );
}