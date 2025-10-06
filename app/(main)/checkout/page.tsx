"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  TruckIcon,
  CheckCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { PaymentMethods } from "@/app/ui/payment/PaymentMethod";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("gcash");
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
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 border-2 border-green-500 mb-6">
          <CheckCircleIcon size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Thank You For Your Order!
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Your order has been received and is being processed.
        </p>

        <div className="bg-gray-50 rounded-lg border border-gray-300 p-6 mb-8 w-full max-w-md text-left shadow">
          <h3 className="text-xl font-semibold mb-4">Order Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Number:</p>
              <p className="font-medium">#ZT-8721394</p>
            </div>
            <div>
              <p className="text-gray-500">Date:</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment Method:</p>
              <p className="font-medium capitalize">
                {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total:</p>
              <p className="font-medium">₱{total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/product"
            className="px-8 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
          >
            Back to Shop
          </Link>
          <button className="px-8 py-3 border border-gray-400 text-black font-semibold rounded-md hover:bg-gray-100 transition">
            Track Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pl-10 pr-10">
      <div className="min-h-screen bg-white text-black  pl-10 pr-10">
        <main className=" mx-auto px-4">
          <div className="flex items-center justify-between pb-5 ">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Link
              href="/product"
              className="inline-flex items-center text-gray-600 hover:text-black transition"
            >
              <ArrowLeftIcon size={16} className="mr-2" />
              Back to Product
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm pb-4">
                <h3 className="text-xl font-semibold mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["First Name", "Last Name", "Email", "Phone"].map(
                    (field) => (
                      <div key={field}>
                        <label className="block text-sm text-gray-600 mb-1">
                          {field}
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* Shipping Info */}
              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mt-5">
                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Address"
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["City", "Province", "Postal Code"].map((field) => (
                      <input
                        key={field}
                        placeholder={field}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                      />
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Special Instructions (Optional)"
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                  ></textarea>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mt-5 mb-5">
                <PaymentMethods onPaymentMethodChange={setPaymentMethod} />
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 pb-4 border-b border-gray-200"
                    >
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.product.category}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="font-semibold">
                            ₱{item.product.price}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span>₱{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax (5%)</span>
                      <span>₱{tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-black">
                        ₱{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ShieldCheckIcon size={16} className="text-black" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <TruckIcon size={16} className="text-black" />
                    <span>Free shipping on orders over ₱150</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
                  >
                    Complete Purchase
                  </button>
                  <Link
                    href="/product"
                    className="block w-full py-3 text-center border border-gray-400 text-black font-semibold rounded-md hover:bg-gray-100 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
