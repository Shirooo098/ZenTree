"use client";

import { useState, useEffect } from "react";
import { useOrder } from "@/app/lib/query/order/order-data";
import { ImageKitProvider, Image } from "@imagekit/next";
import { ArrowLeft, CheckCircle, Package, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading, isError } = useOrder(orderId);

  const [showRefundForm, setShowRefundForm] = useState(false);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [email, setEmail] = useState(""); // Fetched from user table
  const [submitted, setSubmitted] = useState(false);

  // Fetch user email when order is loaded
  useEffect(() => {
    async function fetchUserEmail() {
      if (!order?.user_id) return;
      try {
        const res = await fetch(`/api/users/${order.user_id}`);
        if (!res.ok) return;
        const userData = await res.json();
        setEmail(userData.email || "");
      } catch (err) {
        console.error("Failed to fetch user email", err);
      }
    }
    fetchUserEmail();
  }, [order?.user_id]);

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

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !email) return alert("Please fill in all required fields.");

    try {
      const res = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: order.user_id,
          email,
          reason,
          comments,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(`Error: ${data.error}`);
      }

      setSubmitted(true);
      setShowRefundForm(false);
      alert("Refund request submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        {/* Success Header */}
        <div className="bg-white w-full rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-bold text-gray-900">#{order.order_id}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white w-full rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            {/* Refund Button only visible for Delivered */}
            {order.order_status_name.toLowerCase() === "delivered" && (
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
                onClick={() => setShowRefundForm(true)}
              >
                Request Refund
              </button>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Status</span>
              <span
                className={`font-semibold capitalize ${
                  order.order_status_name.toLowerCase() === "pending"
                    ? "text-yellow-900"
                    : order.order_status_name.toLowerCase() === "process"
                    ? "text-sky-900"
                    : order.order_status_name.toLowerCase() === "shipped"
                    ? "text-teal-900"
                    : order.order_status_name.toLowerCase() === "delivered"
                    ? "text-emerald-900"
                    : order.order_status_name.toLowerCase() === "completed"
                    ? "text-green-900"
                    : order.order_status_name.toLowerCase() === "cancelled"
                    ? "text-red-900"
                    : order.order_status_name.toLowerCase() === "refunded"
                    ? "text-rose-900"
                    : "text-gray-900"
                }`}
              >
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
                <div key={item.product_id} className="flex justify-between items-start py-3 border-b last:border-b-0">
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
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₱{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₱{item.subtotal?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">₱{order.total?.toFixed(2)}</span>
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

      {/* Refund Form Modal */}
      {showRefundForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-transparent backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setShowRefundForm(false)}
              aria-label="Close refund form"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-900 text-center">Request a Refund</h2>

            <form onSubmit={handleRefundSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-army-brown outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Refund Reason */}
              <div>
                <label htmlFor="refund-reason" className="block text-sm font-medium mb-2 text-gray-700">
                  Reason for Refund <span className="text-red-500">*</span>
                </label>
                <select
                  id="refund-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-army-brown outline-none"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Wrong item received">Wrong item received</option>
                  <option value="Item arrived damaged">Item arrived damaged</option>
                  <option value="Order didn’t arrive">Order didn’t arrive</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Additional Comments (optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any extra details here..."
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-army-brown outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setShowRefundForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Submit Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
