import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { getUserAddresses } from "@/app/actions/address/get-address.action";
import ShippingAddress from "@/app/ui/profile/ShippingAddress";


export default async function ShippingAddressPage() {

  const session = await auth.api.getSession({ headers: await headers() });


  if (!session || !session.user?.id) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <p className="text-lg font-semibold">
          You need to log in to view your shipping addresses.
        </p>
      </div>
    );
  }


  const userId = session.user.id;


  const addresses = await getUserAddresses(userId);


  return (
    <div className="flex gap-10 p-8">
    
      <div className="flex-1">
        <ShippingAddress userId={userId} initialAddresses={addresses} />
      </div>
    </div>
  );
}
