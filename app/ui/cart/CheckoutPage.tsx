"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ShippingAddress from "@/app/ui/cart/ShippingAddress";
import CustomerInformation from "@/app/ui/cart/CustomerInformation";
import OrderSummary from "@/app/ui/cart/OrderSummary";
import { User } from "@/db/schema";
import { redirect } from "next/navigation";
import { useUserAddress } from "@/app/lib/query/address/address-data";
import { useCart } from "@/app/lib/query/cart/cart-data";
import { LatestInvoicesSkeleton } from "@/components/ui/skeleton/skeleton";

export interface CheckoutPageProps {
  userData: Partial<User>;
}

export default function CheckoutPage({ userData }: CheckoutPageProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: cart } = useCart();
  const { data: userAddress } = useUserAddress();

  if(!userData) redirect("/sign-in")

  console.log('Cart data:', cart);
  console.log('User address:', userAddress);

  const cartItems = [
    {
      id: 1,
      product: {
        name: "Mini Bonsai Tree",
        category: "Bonsai",
        price: 350,
        image_url: "/bonsai1.jpg",
      },
      quantity: 2,
    },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => setShowConfirmation(true);

  return (
    <div className="bg-white text-black p-10 rounded-sm">
      <main className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link
            href="/product"
            className="inline-flex items-center text-gray-600 hover:text-black transition"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Product
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInformation userData={userData} />
            <ShippingAddress userAddress={userAddress}/>
          </div>

          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>
      </main>
    </div>
  );
}
