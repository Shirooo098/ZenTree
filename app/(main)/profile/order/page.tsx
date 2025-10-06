"use client"

import { Loader } from "@/app/components/loader/loader";
import { useAllOrders } from "@/app/lib/query/order/order-data";
import { Button } from "@/components/ui/button";
import { ImageKitProvider, Image } from "@imagekit/next";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useAllOrders();

  if (isLoading) return <Loader />;
  if (isError) return <p>Error loading orders</p>;
  if(!orders) return <div>Error fetching Orders</div>

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ul className="space-y-4">
        {orders?.map(order => (
          <div key={order.order_id} className="border rounded-lg p-4">
            <p className="font-semibold">
              Order #{order.order_id} — {order.order_status_name}
            </p>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>

            <ul className="mt-2 ml-4 list-disc">
              {order.products.map(p => (
                <li key={p.product_id}>
                  <ImageKitProvider urlEndpoint={p.product_image_url}>
                    <Image
                      priority
                      src={p.product_image_url}
                      alt={p.product_name}
                      width={100}
                      height={100}
                    />
                  </ImageKitProvider>
                  <p>{p.product_name} </p>
                  <p>Price: ₱{p.price_at_purchase}</p>
                  <p>Quantity {p.quantity}</p>
                  <p>Total Price: ₱{p.price_at_purchase! * p.quantity}</p> 
                </li>
              ))}
            </ul>
             <Link href={`/profile/order/${order?.order_id}`}>
                <Button>Check Order</Button>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
