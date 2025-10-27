"use client";

import { useEffect, useState } from "react";
import {
  useMarkOrderDelivered,
  useOrder,
} from "@/app/lib/query/order/order-data";
import { ImageKitProvider, Image } from "@imagekit/next";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sendReceiptAction } from "@/app/actions/send-receipt.action";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import RefundRequestDialog from "@/app/ui/refund/RefundRequestDialog";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const { user } = useUser();
  const markDeliveredMutation = useMarkOrderDelivered();

  const [showRefundForm, setShowRefundForm] = useState(false);
  const [isSendingReceipt, setIsSendingReceipt] = useState(false);

  useEffect(() => {
    if (order) {
      console.log("🔍 Order data:", {
        order_id: order.order_id,
        user_id: order.user_id,
        products: order.products.length
      });
    }
    if (user) {
      console.log("🔍 User data:", {
        email: user.email,
        name: user.name
      });
    }
  }, [order, user]);

  const getOrderStatusClasses = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "text-yellow-900";
      case "processing":
        return "text-sky-900";
      case "shipped":
        return "text-teal-900";
      case "delivered":
        return "text-emerald-900";
      case "completed":
        return "text-green-900";
      case "cancelled":
        return "text-red-900";
      case "refunded":
        return "text-rose-900";
      case "refund processing":
        return "text-orange-900";
      case "refund rejected":
        return "text-pink-900";
      default:
        return "text-gray-900";
    }
  };

  const handleSendReceipt = async () => {
    if (!order || !user.email) {
      toast.error("Unable to send receipt. Missing order or email information.");
      return;
    }

    setIsSendingReceipt(true);

    try {
      const result = await sendReceiptAction({
        to: user.email,
        orderDetails: order,
        userName: user.name,
      });

      if (result.success) {
        toast.success("Receipt sent successfully to your email!");
      } else {
        toast.error("Failed to send receipt. Please try again.");
      }
    } catch (err) {
      console.error("Error sending receipt:", err);
      toast.error("Something went wrong while sending the receipt.");
    } finally {
      setIsSendingReceipt(false);
    }
  };

  const handleMarkAsDelivered = () => {
    markDeliveredMutation.mutate(orderId, {
      onSuccess: () => {
        toast.success("Order marked as Received!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to mark order as Received");
      },
    });
  };

  const handleRefundSuccess = () => {
    toast.success("Refund request submitted successfully!");
    refetch();
  };

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
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Order not found
          </h2>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find this order.
          </p>
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

  const orderStatusLower = order.order_status_name.toLowerCase();
  const canRequestRefund = orderStatusLower === "completed";
  const canMarkDelivered = orderStatusLower === "shipped";
  const isRefundPending = orderStatusLower === "refund processing";
  const isRefunded = orderStatusLower === "refunded";
  const isRefundRejected = orderStatusLower === "refund rejected";

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white w-full rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded">
            <p className="text-sm text-gray-600">Serial Number</p>
            <p className="text-xl font-bold text-gray-900">#{order.order_id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white w-full rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
            </div>

            {/* Action Buttons based on order status */}
            <div className="flex gap-2">
              {canRequestRefund && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSendReceipt}
                    disabled={isSendingReceipt || !user.email}
                  >
                    {isSendingReceipt ? "Sending..." : "Get Receipt"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRefundForm(true)}
                  >
                    Request Refund
                  </Button>
                </>
              )}
              
              {canMarkDelivered && (
                <Button
                  variant="outline"
                  onClick={handleMarkAsDelivered}
                  disabled={markDeliveredMutation.isPending}
                >
                  {markDeliveredMutation.isPending
                    ? "Marking as Received..."
                    : "Mark as Received"}
                </Button>
              )}

              {isRefundPending && (
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Refund request is being processed
                </div>
              )}

              {isRefunded && (
                <div className="bg-rose-100 text-rose-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Order has been refunded
                </div>
              )}

              {isRefundRejected && (
                <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-lg text-sm font-medium">
                  Refund request was rejected
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Status</span>
              <span className={`font-semibold capitalize ${getOrderStatusClasses(order.order_status_name)}`}>
                {order.order_status_name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold">
                {new Date(order.created_at).toLocaleDateString("en-PH", {
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
                  <div className="flex items-center gap-4">
                    <ImageKitProvider urlEndpoint={item.product_image_url}>
                      <Image
                        priority
                        src={item.product_image_url}
                        alt={item.product_name}
                        width={80}
                        height={80}
                        className="rounded-md border"
                      />
                    </ImageKitProvider>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₱{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₱{item.subtotal?.toFixed(2)}
                      </p>
                    </div>
                    {canRequestRefund && (
                      <Link
                        href={`/profile/order/${order.order_id}/review/${item.product_id}`}
                      >
                        <Button variant="outline" className="mt-3">
                          Review
                        </Button>
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
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/product"
            className="flex-1 flex items-center justify-center gap-2 border-2 bg-army-brown text-main-white hover:bg-hover-army-brown px-6 py-3 rounded-lg font-semibold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link
            href="/profile/order"
            className="flex-1 bg-dark-brown text-main-white hover:bg-hover-dark-brown px-6 py-3 rounded-lg font-semibold text-center transition"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* Refund Request Dialog */}
      <RefundRequestDialog
        order={order}
        userEmail={user.email || ""}
        isOpen={showRefundForm}
        onClose={() => setShowRefundForm(false)}
        onSuccess={handleRefundSuccess}
      />
    </div>
  );
}