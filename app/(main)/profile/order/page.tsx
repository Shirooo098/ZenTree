"use client";

import { Loader } from "@/app/components/loader/loader";
import { useAllOrders } from "@/app/lib/query/order/order-data";
import { Button } from "@/components/ui/button";
import { ImageKitProvider, Image } from "@imagekit/next";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useAllOrders();

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-center text-red-600">Error loading orders</p>;
  if (!orders || orders.length === 0)
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-600">
        <p className="text-lg font-medium mb-2">No orders found.</p>
        <Link href="/product">
          <Button className="bg-army-brown hover:bg-hover-army-brown text-main-white">
            Browse Products
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="w-full  px-4 sm:px-8">
      {/* <h1 className="text-3xl font-bold text-dark-brown mb-8 text-center">
        My Orders
      </h1> */}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition w-full"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4">
              <div>
                <p className="text-lg font-semibold text-dark-brown">
                  Order #{order.order_id}
                </p>
                <p className="text-sm text-gray-500">
                  Placed on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full
  ${
    order.order_status_name.toLowerCase().includes("pending")
      ? "bg-yellow-300 text-yellow-900"
      : order.order_status_name.toLowerCase().includes("process")
        ? "bg-sky-300 text-sky-900"
        : order.order_status_name.toLowerCase().includes("shipped")
          ? "bg-teal-300 text-teal-900"
          : order.order_status_name.toLowerCase().includes("delivered")
            ? "bg-emerald-400 text-emerald-900"
            : order.order_status_name.toLowerCase().includes("completed")
              ? "bg-green-400 text-green-900"
              : order.order_status_name.toLowerCase().includes("cancelled")
                ? "bg-red-300 text-red-900"
                : order.order_status_name.toLowerCase().includes("refunded")
                  ? "bg-rose-300 text-rose-900"
                  : "bg-gray-300 text-gray-900"
  }`}
              >
                {order.order_status_name}
              </span>
            </div>

            <div className="space-y-4">
              {order.products.map((p) => (
                <div
                  key={p.product_id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4 last:border-0"
                >
                  <div className="flex-shrink-0">
                    <ImageKitProvider urlEndpoint={p.product_image_url}>
                      <Image
                        priority
                        src={p.product_image_url}
                        alt={p.product_name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </ImageKitProvider>
                  </div>

                  <div className="flex-1 w-full flex justify-between items-center text-center sm:text-left">
                    <div className="text-left">
                      <p className="font-semibold text-dark-brown">
                        {p.product_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {p.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Price: ₱{p.price_at_purchase!.toFixed(2)}
                      </p>
                      <p className="text-md font-semibold text-army-brown mt-1">
                        Total: ₱{(p.price_at_purchase! * p.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <Link href={`/profile/order/${order.order_id}`}>
                <Button className="bg-dark-brown hover:bg-hover-dark-brown text-main-white px-5 py-2 rounded-lg transition">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
