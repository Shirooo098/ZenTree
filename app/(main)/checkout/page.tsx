"use client";

import { Loader } from "@/app/components/loader/loader";
import CheckoutPage from "@/app/ui/cart/CheckoutPage";
import { useUser } from "@/context/user-context";
import { Suspense } from "react";

export default function Checkout() {
  const { user } = useUser();

  return (
    <div className="p-5">
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader size={20} thickness={4} />
        </div>
      }>
        <CheckoutPage userData={user} />
      </Suspense>
    </div>
  );
}
