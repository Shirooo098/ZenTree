"use client";


import RateForm from "@/app/components/forms/reviews/rate-form";
import { useOrder } from "@/app/lib/query/order/order-data";
import { ImageKitProvider, Image } from "@imagekit/next";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react"; // ✅ import useState

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, isError } = useOrder(orderId);

  const [showReviewForm, setShowReviewForm] = useState(false); // ✅ state

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">We couldn&apos;t find this order.</p>
          <Link
            href="/product"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-gray-900">#{order.order_id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Status</span>
              <span className="font-semibold text-green-600 capitalize">
                {order.order_status_name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-start py-3 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <ImageKitProvider urlEndpoint={item.product_image_url}>
                      <Image
                        priority
                        src={item.product_image_url}
                        alt={item.product_name}
                        width={100}
                        height={100}
                      />
                    </ImageKitProvider>
                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ₱{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₱{item.subtotal?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    {order.order_status_name?.toLowerCase() === "paid" && (
                      <Link
                        href={`/profile/order/${orderId}/review/${item.product_id}`}
                        className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                      >
                        Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">
                ₱{order.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Link
            href="/product"
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link
            href="/profile/order"
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
