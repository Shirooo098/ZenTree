import SideProfile from "@/app/ui/profile/SideProfile";
import { Toaster } from "sonner";
import { UserProvider, useUser } from "@/context/user-context";

export default function RootLayout({ children }: {children: React.ReactNode}) {

  const { user } = useUser()

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
