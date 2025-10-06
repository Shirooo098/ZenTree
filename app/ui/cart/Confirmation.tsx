"use client";

import Link from "next/link";
import { CheckCircleIcon } from "lucide-react";

interface OrderConfirmationProps {
  paymentMethod: string;
  total: number;
}

export default function Confirmation({
  paymentMethod,
  total,
}: OrderConfirmationProps) {
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
