import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { getUserAddresses } from "@/app/actions/address/get-address.action";
import SideProfile from "@/app/ui/profile/SideProfile";
import ShippingAddress from "@/app/ui/profile/ShippingAddress";

export default async function ShippingAddressPage() {
  // 1️⃣ Get the logged-in session
  const session = await auth.api.getSession({ headers: await headers() });

  // 2️⃣ Handle no user (not logged in)
  if (!session || !session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-lg font-semibold">
          You need to log in to view your shipping addresses.
        </p>
      </div>
    );
  }

  // 3️⃣ Get userId from session
  const userId = session.user.id;

  // 4️⃣ Fetch user’s addresses
  const addresses = await getUserAddresses(userId);

  // 5️⃣ Pass userId and addresses into the client component
  return (
    <div className="flex gap-10 p-8">
      <SideProfile />
      <div className="flex-1">
        <ShippingAddress userId={userId} initialAddresses={addresses} />
      </div>
    </div>
  );
}
