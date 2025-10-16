"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ShippingAddress from "@/app/ui/cart/ShippingAddress";
import CustomerInformation from "@/app/ui/cart/CustomerInformation";
import OrderSummary from "@/app/ui/cart/OrderSummary";
import { User } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useUserAddress } from "@/app/lib/query/address/address-data";
import { useCart } from "@/app/lib/query/cart/cart-data";
import { toast } from "sonner";
import { CartProps } from "@/app/types/definition";

export interface CheckoutPageProps {
  userData: Partial<User>;
}

export default function CheckoutPage({ userData }: CheckoutPageProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CartProps | null>(null);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { data: cartData } = useCart();
  const { data: userAddress } = useUserAddress();

  // Check authentication
  useEffect(() => {
    if (!userData) {
      router.push("/sign-in");
    }
  }, [userData, router]);

  // Load checkout data
  useEffect(() => {
    const loadCheckoutData = () => {
      // Check for direct checkout data in sessionStorage (from product page)
      const storedData = sessionStorage.getItem('checkout_data');
      
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          
          // Only use stored data if it's from product page (direct checkout)
          if (parsed.isDirect && parsed.fromProductPage) {
            setIsDirectCheckout(true);
            
            // Transform to CartProps format - ONLY the selected product
            const transformedData: CartProps = {
              cart_id: 0,
              items: parsed.items,
              totalItems: parsed.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
              totalPrice: parsed.items.reduce((sum: number, item: any) => 
                sum + (item.product_price * item.quantity), 0
              ),
            };
            
            setCheckoutData(transformedData);
            setIsLoading(false);
            return; 
          }
        } catch (error) {
          console.error('Error parsing checkout data:', error);
          toast.error("Invalid checkout data");
          router.push("/product");
          return;
        }
      }
      
      // Use cart data only if NOT direct checkout
      if (cartData && !storedData) {
        setCheckoutData(cartData);
        setIsDirectCheckout(false);
        setIsLoading(false);
      } else if (!storedData && !cartData) {
        setIsLoading(false);
      }
    };

    loadCheckoutData();
  }, [cartData, router]);

  if (isLoading) {
    return (
      <div className="bg-white text-black p-10 rounded-sm">
        <div className="flex items-center justify-center h-96">
          <p className="text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Check if we have checkout data
  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
    return (
      <div className="bg-white text-black p-10 rounded-sm">
        <main className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <p className="text-xl">No items to checkout.</p>
            <Link
              href="/product"
              className="inline-flex items-center px-6 py-3 bg-dark-brown text-white rounded-md hover:bg-hover-dark-brown transition"
            >
              Browse Products
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate totals
  const subtotal = checkoutData.items.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    // Clear direct checkout data after proceeding
    if (isDirectCheckout) {
      sessionStorage.removeItem('checkout_data');
    }
    setShowConfirmation(true);
  };

  return (
    <div className="bg-white text-black p-10 rounded-sm">
      <main className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between pb-5">
          <h1 className="text-3xl font-bold">
            Checkout {isDirectCheckout && <span className="text-lg text-gray-600">(Direct Purchase)</span>}
          </h1>
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
            <ShippingAddress userAddress={userAddress} />
          </div>

          <OrderSummary
            cartItems={checkoutData.items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onCheckout={handleCheckout}
            isDirectCheckout={isDirectCheckout}
          />
        </div>
      </main>
    </div>
  );
}