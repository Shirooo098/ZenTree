import "./../../globals.css";
import "./../../globalproduct.css";
import SideProfile from "@/app/ui/profile/SideProfile";
import { Toaster } from "sonner";

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  return (
      <div className="flex justify-between gap-6 w-full pt-40 pb-20 px-21 items-start">
          <SideProfile/>
          <div className="w-full p-8 bg-gray-100 rounded-md inset-shadow-nav">
            {children}
          </div>
          <Toaster/>
      </div>
  );
}
