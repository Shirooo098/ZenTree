"use client";

import { ShoppingCart } from "lucide-react";
import { ReceiptText } from "lucide-react";
import CartItems from "../../ui/cart/CartItems";
import OrderSummary from "../../ui/cart/OrderSummary";

export default function Cart() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-5 w-full max-w-6xl px-5">
        {/* Cart Section */}
        <div className="bg-main-white rounded-sm basis-[60%]">
          <div className="m-10">
            <span className="flex justify-start items-center gap-3 font-bold text-2xl">
              <ShoppingCart /> Your Shopping Cart
            </span>
            <CartItems />
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-main-white rounded-sm basis-[40%]">
          <div className="m-10">
            <span className="flex justify-start items-center gap-3 font-bold text-2xl">
              <ReceiptText /> Order Summary
            </span>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
