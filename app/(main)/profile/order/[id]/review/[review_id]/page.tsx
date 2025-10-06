// app/profile/order/[id]/review/[productId]/page.tsx
"use client";

import RateForm from "@/app/components/forms/rate-form";
import { useOrder } from "@/app/lib/query/order/order-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProductReviewPage() {
  const { id, productId } = useParams<{ id: string; productId: string }>();
  const router = useRouter();
  const orderId = Number(id);
  const prodId = Number(productId);

  const { data: order, isLoading } = useOrder(orderId);

  const product = order?.products.find((p) => p.product_id === prodId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Product not found
          </h2>
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
        {/* Back Button */}
        <Link
          href={`/profile/order/${orderId}`}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Order
        </Link>

        {/* Product Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Review Your Purchase
          </h2>
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">
                {product.product_name}
              </p>
              <p className="text-sm text-gray-600">
                Purchased on{" "}
                {new Date(order!.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <RateForm
          productId={prodId}
          orderId={orderId}
          productName={product.product_name}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}