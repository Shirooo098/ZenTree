import NavBar from "../ui/navbar";
import Footer from "../ui/landing/Footer";
import { Toaster } from "@/components/ui/sonner"
import { TanstackProvider } from "@/context/tanstack-provider";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <div className="fixed py-10 px-4 sx:px-10 sm:px-14 lg:px-20 flex w-full items-center z-20">
          <NavBar/>
        </div>
        <TanstackProvider>
          {children}
        </TanstackProvider>
        <Toaster />
        <Footer />
    </div>
  );
}
