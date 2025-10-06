"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { PaymentMethods } from "@/app/ui/cart/PaymentMethod";
import ShippingAddress from "@/app/ui/cart/ShippingAddress";
import CustomerInformation from "@/app/ui/cart/CustomerInformation";
import OrderConfirmation from "@/app/ui/cart/Confirmation"; 
import OrderSummary from "@/app/ui/cart/OrderSummary";

interface CheckoutClientProps {
  userData: {
    id: string;
    name: string;
    username?: string | null;
    email: string;
    phoneNumber?: string | null;
  };
}

export default function CheckoutClient({ userData }: CheckoutClientProps) {
  const [paymentMethod, setPaymentMethod] = useState("maya");
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  if (showConfirmation) {
    return <OrderConfirmation paymentMethod={paymentMethod} total={total} />;
  }

  return (
    <div className="min-h-screen bg-white text-black pt-40 px-10">
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
            <ShippingAddress />

            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              <PaymentMethods onPaymentMethodChange={setPaymentMethod} />
            </div>
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
