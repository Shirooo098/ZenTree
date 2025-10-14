import { auth } from "@/app/lib/auth";
import CheckoutPage from "@/app/ui/cart/CheckoutPage";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Checkout() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const normalizedUser = {
    ...session.user,
    image: session.user.image ?? null,
    phoneNumber: session.user.phoneNumber ?? null,
    username: session.user.username ?? null,
    displayUsername: session.user.displayUsername ?? null,
    role: session.user.role ?? null,
    banned: session.user.banned ?? null,
    banReason: session.user.banReason ?? null,
    banExpires: session.user.banExpires ?? null,
  };

  return (
    <div className="pt-40 pl-10 pr-10">
      <CheckoutPage userData={normalizedUser} />
    </div>
  );
}
