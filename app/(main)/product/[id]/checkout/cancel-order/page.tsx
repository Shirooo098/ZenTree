"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelOrderPage() {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(true);

  useEffect(() => {
    const cancelOrder = async () => {
      try {
        const storedOrderId = sessionStorage.getItem("pending_order_id");

        if (storedOrderId) {
          await fetch(`/api/cancel-order?order_id=${storedOrderId}`, {
            method: "GET",
          });
        }

        // Clear session storage
        sessionStorage.removeItem("pending_order_id");
        sessionStorage.removeItem("paypal_order_id");

      } catch (error) {
        console.error("Error cancelling order:", error);
      } finally {
        setIsCancelling(false);
      }
    };

    cancelOrder();
  }, []);

  if (isCancelling) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cancelling order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
          Your items are still in your cart.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/cart")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Return to Cart
          </Button>
          
          <Button
            onClick={() => router.push("/product")}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Need help? <a href="/contact" className="text-green-600 hover:underline">Contact us</a>
        </p>
      </div>
    </div>
  );
}