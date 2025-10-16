import { auth } from "@/app/lib/auth";
import { UserProvider } from "@/context/user-context";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function RootLayout({ children }: {children: React.ReactNode}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) redirect("/login")

  const user = {
    id: session.user.id!,
    name: session.user.name!,
    username: session.user.username,
    phoneNumber: session.user.phoneNumber,
    email: session.user.email!,
    avater: session.user.image,
    role: session.user.role,
  };

  return (
    <UserProvider user={user}>
      <div className="flex justify-between gap-6 w-full pt-40 pb-20 px-21">
          <div className="w-full p-8 bg-gray-100 rounded-md inset-shadow-nav">
            {children}
          </div>
          <Toaster/>
      </div>
    </UserProvider>
  );
}