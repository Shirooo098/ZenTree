"use client";

import RateForm from "@/app/components/forms/rate-form";
import { useOrder } from "@/app/lib/query/order/order-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProductReviewPage() {
  const params = useParams<{ id: string; productId: string }>();
  const router = useRouter();

  const orderId = params?.id ? Number(params.id) : 0;
  const prodId = params?.productId ? Number(params.productId) : 0;
  
  console.log("Parsed orderId:", orderId);
  console.log("Parsed prodId:", prodId);

  const { data: order, isLoading, error } = useOrder(orderId);

  if (!orderId || !prodId || isNaN(orderId) || isNaN(prodId)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Invalid order or product ID
          </h2>
          <p className="text-red-600 mb-4">
            Order ID: {params?.id} (parsed: {orderId})
            <br />
            Product ID: {params?.productId} (parsed: {prodId})
          </p>
          <Link
            href="/profile/order"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Failed to load order
          </h2>
          <p className="text-red-600 mb-4">
            {error?.message || "Order not found"}
          </p>
          <Link
            href="/profile/order"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const product = order?.products?.find((p: any) => {
    const pid = Number(p.product_id || p.id);
    return pid === prodId;
  });

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Product not found in this order
          </h2>
          <p className="text-gray-600 mb-4">
            Order ID: {orderId}, Product ID: {prodId}
          </p>
          <Link
            href={`/profile/order/${orderId}`}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Order
          </Link>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    setTimeout(() => {
      router.push(`/profile/order/${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/profile/order/${orderId}`}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Order
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Review Your Purchase
          </h2>
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">
                {product.product_name || ""}
              </p>
              <p className="text-sm text-gray-600">
                Purchased on{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <RateForm
          productId={prodId}
          orderId={orderId}
          productName={product.product_name || ""}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}