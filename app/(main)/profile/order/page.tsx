"use client";

import { useState, useMemo } from "react";
import { Loader } from "@/app/components/loader/loader";
import { useAllOrders, useCancelOrder } from "@/app/lib/query/order/order-data";
import { Button } from "@/components/ui/button";
import { ImageKitProvider, Image } from "@imagekit/next";
import Link from "next/link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useAllOrders();
  const cancelOrder = useCancelOrder();

  const [searchQuery, setSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const tabStatuses = [
    "",
    "pending",
    "processing",
    "shipped",
    "completed",
    "cancelled",
    "refunded",
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const selectedStatus = tabStatuses[tabValue];

    return orders.filter((order) => {
      const matchesSearch =
        order.order_id.toString().includes(searchQuery) ||
        order.products.some((p) =>
          p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus = selectedStatus
        ? order.order_status_name.toLowerCase() === selectedStatus
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, tabValue]);

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

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-300 text-yellow-900";
      case "processing":
        return "bg-sky-300 text-sky-900";
      case "shipped":
        return "bg-teal-300 text-teal-900";
      case "completed":
        return "bg-emerald-400 text-emerald-900";
      case "cancelled":
        return "bg-red-300 text-red-900";
      case "refunded":
        return "bg-rose-300 text-rose-900";
      default:
        return "bg-gray-300 text-gray-900";
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 font-sans">
      <div className="flex justify-between items-center w-full border-b border-black pb-5 mb-6">
        <h1 className="text-2xl font-bold">Order History</h1>
      </div>

      <Box sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="order status tabs"
            variant="fullWidth"
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              width: "100%",
              "& .MuiTabs-indicator": {
                backgroundColor: "#4B3B2A",
                height: "2px",
                borderRadius: "4px 4px 0 0",
              },
              "& .MuiTab-root": {
                flex: 1,
                fontWeight: "bold",
                textTransform: "none",
                color: "black",
                "&.Mui-selected": {
                  color: "#4B3B2A",
                },
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Processing" />
            <Tab label="Shipped" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
            <Tab label="Refunded" />
          </Tabs>
        </Box>
      </Box>

      <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">
            No orders match your criteria.
          </p>
        )}

        {filteredOrders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4">
              <div>
                <p className="text-lg font-semibold text-dark-brown">
                  Serial #{order.order_id}
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
                className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(
                  order.order_status_name
                )}`}
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

            <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3">
              {order.order_status_name.toLowerCase() === "pending" && (
                <Button
                  onClick={() => cancelOrder.mutate(String(order.order_id))}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}

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
