"use client";

import Image from "next/image";
import { ShieldCheckIcon, TruckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartItemProps } from "@/app/types/definition";
import { useCheckout, useDirectCheckout } from "@/app/lib/query/checkout/checkout-data";
import { toast } from "sonner";
import { useState } from "react";

interface OrderSummaryProps {
  cartItems: CartItemProps[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  isDirectCheckout?: boolean;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
  isDirectCheckout = false,
}: OrderSummaryProps) {
  const router = useRouter();
  const { mutate: checkoutFromCart, isPending: isCartPending } = useCheckout();
  const { mutate: directCheckout, isPending: isDirectPending } = useDirectCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompletePurchase = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    try {
      if (isDirectCheckout) {
        // Direct checkout - create order and redirect to PayPal
        const items = cartItems.map(item => ({
          productId: item.product_id,
          quantity: item.quantity,
        }));

        directCheckout(items, {
          onSuccess: () => {
            // Clear the checkout data after successful redirect setup
            sessionStorage.removeItem('checkout_data');
          },
          onError: (error: Error) => {
            setIsProcessing(false);
            toast.error(error.message || "Failed to process checkout");
          }
        });
      } else {
        // Cart checkout
        const cartProductIds = cartItems.map(item => item.cart_products_id);
        checkoutFromCart(cartProductIds, {
          onSuccess: () => {
            // Cleanup handled by the mutation
          },
          onError: (error: Error) => {
            setIsProcessing(false);
            toast.error(error.message || "Failed to process checkout");
          }
        });
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error("An unexpected error occurred");
      console.log(error)
    }
  };

  const isPending = isCartPending || isDirectPending || isProcessing;

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm sticky top-24">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        {/* Order Items */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {cartItems.map((item, index) => (
            <div
              key={item.cart_products_id || `item-${index}`}
              className="flex items-start space-x-4 pb-4 border-b border-gray-200"
            >
              <Image
                src={item.product_image_url}
                alt={item.product_name}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product_name}</h4>
                <p className="text-sm text-gray-500">{item.product_category}</p>
                <div className="flex items-center mt-1">
                  <span className="font-semibold">₱{Number(item.product_price).toFixed(2)}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}</span>
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

        {/* Trust Badges */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ShieldCheckIcon size={16} className="text-black" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TruckIcon size={16} className="text-black" />
            <span>Free shipping on orders over ₱150</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCompletePurchase}
            disabled={isPending}
            className="block w-full py-3 hover:cursor-pointer transition-colors duration-200 border-none bg-dark-brown text-main-white hover:bg-hover-dark-brown font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Processing..." : "Complete Purchase"}
          </button>

          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push("/product")}
            disabled={isPending}
            className="block w-full py-3 hover:cursor-pointer transition-colors duration-200 border-none bg-army-brown text-main-white hover:bg-hover-army-brown font-semibold rounded-md disabled:opacity-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}