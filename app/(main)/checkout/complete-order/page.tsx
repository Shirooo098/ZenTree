"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompleteOrder from "@/app/ui/checkout/CompleteOrder";

function CompleteOrderValidator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const paypalOrderId = searchParams.get("token");
  const [storedOrderId, setStoredOrderId] = useState<string | null>(null);
  const [storedPaypalOrderId, setStoredPaypalOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsClient(true);
    setStoredOrderId(sessionStorage.getItem("pending_order_id"));
    setStoredPaypalOrderId(sessionStorage.getItem("paypal_order_id"));
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-600">
            Please wait while we prepare your order.
          </p>
        </div>
      </div>
    );
  }

  if (!paypalOrderId || !storedOrderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Payment
          </h2>
          <p className="text-gray-600 mb-6">
            Missing payment information. Please try again.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => router.push("/cart")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Cart
            </Button>
            <Button
              onClick={() => router.push("/product")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paypalOrderId !== storedPaypalOrderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Invalid Payment Token
          </h2>
          <p className="text-gray-600 mb-6">
            The payment token doesn&apos;t match. Please try again.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => router.push("/cart")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Cart
            </Button>
            <Button
              onClick={() => router.push("/product")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CompleteOrder
      paypalOrderId={paypalOrderId}
      storedOrderId={storedOrderId}
    />
  );
}

export default function CompleteOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-gray-600">
              Please wait while we prepare your order.
            </p>
          </div>
        </div>
      }
    >
      <CompleteOrderValidator />
    </Suspense>
  );
}
