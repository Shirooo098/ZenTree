"use client";

import { useCompleteOrder } from '@/app/lib/query/order/order-data';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface CompleteOrderProps {
  paypalOrderId: string;
  storedOrderId: string;
}

export default function CompleteOrder({ paypalOrderId, storedOrderId }: CompleteOrderProps) {
  const completeOrder = useCompleteOrder();
  const router = useRouter();

  useEffect(() => {
    const processPayment = async () => {
      if (!completeOrder.isPending && !completeOrder.isSuccess && !completeOrder.isError) {
        completeOrder.mutate(
          {
            orderId: Number(storedOrderId),
            paypalOrderId: paypalOrderId,
          },
          {
            onSuccess: (data) => {
              setTimeout(() => {
                router.push(`/profile/order/${data.orderId}`);
              }, 2000);
            },
          }
        );
      }
    };

    processPayment();
  }, [paypalOrderId, storedOrderId, completeOrder, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {completeOrder.isPending && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment with PayPal.
            </p>
          </>
        )}

        {completeOrder.isSuccess && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment has been confirmed successfully!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your order...
            </p>
          </>
        )}

        {completeOrder.isError && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {completeOrder.error?.message || "Failed to complete payment"}
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
          </>
        )}
      </div>
    </div>
  );
}