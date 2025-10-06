"use client";

import Image from "next/image";
import { ShieldCheckIcon, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  cartItems: {
    id: number;
    product: {
      name: string;
      category: string;
      price: number;
      image_url: string;
    };
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
}: OrderSummaryProps) {
    const router = useRouter();
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm top-24">
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
                <p className="text-sm text-gray-500">{item.product.category}</p>
                <div className="flex items-center mt-1">
                  <span className="font-semibold">₱{item.product.price}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
            onClick={onCheckout}
             className="block w-full py-3 hover:cursor-pointer transition-colors duration-200 border-none bg-dark-brown text-main-white hover:bg-hover-dark-brown font-semibold rounded-md"
             
          >
            Complete Purchase
          </button>
          <button
      onClick={() => router.push("/product")}
      className="block w-full py-3 hover:cursor-pointer transition-colors duration-200 border-none bg-army-brown text-main-white hover:bg-hover-army-brown font-semibold rounded-md"
    >
      Continue Shopping
    </button>
        </div>
      </div>
    </div>
  );
}
