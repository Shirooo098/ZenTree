import SideProfile from "@/app/ui/profile/SideProfile";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/user-context";
import { getCurrentUser } from "@/server/users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  const user = await getCurrentUser()
  return (
    <UserProvider user={user}>
      <div className="flex justify-between gap-6 w-full pt-40 pb-20 px-21">
          <SideProfile/>
          <div className="w-full p-8 bg-gray-100 rounded-md inset-shadow-nav">
            {children}
          </div>
          <Toaster/>
      </div>
    </UserProvider>
  );
}