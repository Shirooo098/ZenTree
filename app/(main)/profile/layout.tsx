import "./../../globals.css";
import "./../../globalproduct.css";
import SideProfile from "@/app/ui/profile/SideProfile";
import { Toaster } from "sonner";

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  return (
      <div className="flex justify-between gap-10 w-full pt-40 pb-20 px-10">
          <SideProfile/>
          <div className="w-full bg-gray-100">
            {children}
          </div>
          <Toaster/>
      </div>
  );
}
