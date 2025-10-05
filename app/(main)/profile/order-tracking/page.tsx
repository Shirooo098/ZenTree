'use client'
import React, { useState } from 'react'
import { OrderCard } from '@/app/ui/order/ordercard'
import { OrderDetails } from '@/app/ui/order/orderdetails'
import { OrderTracking } from '@/app/ui/order/tracking'
import { PackageIcon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from "next/navigation"

export const mockOrders = [
  {
    id: 'ZT-8721394',
    date: '2023-11-15',
    total: 147.45,
    status: 'Delivered',
    items: [
      {
        id: 1,
        name: 'Japanese Maple Bonsai',
        price: 129.0,
        quantity: 1,
        image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/6wUJPJsuYnEiUw7g3B3te5/image.png',
      },
    ],
    tracking: {
      carrier: 'UPS',
      number: '1Z999AA10123456784',
      events: [
        { date: '2023-11-15', time: '09:00', status: 'Order processed', location: 'Warehouse' },
        { date: '2023-11-16', time: '14:30', status: 'Shipped', location: 'Distribution Center' },
        { date: '2023-11-17', time: '11:45', status: 'Delivered', location: 'Customer Address' },
      ],
    },
  },
  {
    id: 'ZT-7651238',
    date: '2023-10-22',
    total: 215.9,
    status: 'Delivered',
    items: [
      {
        id: 2,
        name: 'Ficus Bonsai',
        price: 89.95,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1599598177991-ec67b5c37318?auto=format&fit=crop&w=1925&q=80',
      },
      {
        id: 3,
        name: 'Premium Bonsai Tool Kit',
        price: 125.95,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1770&q=80',
      },
    ],
    tracking: {
      carrier: 'FedEx',
      number: 'FE1234567890',
      events: [
        { date: '2023-10-22', time: '10:00', status: 'Order processed', location: 'Warehouse' },
        { date: '2023-10-23', time: '13:20', status: 'Shipped', location: 'Distribution Center' },
        { date: '2023-10-24', time: '15:45', status: 'Delivered', location: 'Customer Address' },
      ],
    },
  },
  {
    id: 'ZT-6543219',
    date: '2023-09-05',
    total: 82.5,
    status: 'Delivered',
    items: [
      {
        id: 4,
        name: 'Bonsai Soil Mix - Premium',
        price: 42.5,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1632538069359-e3a0a0a82418?auto=format&fit=crop&w=1964&q=80',
      },
      {
        id: 5,
        name: 'Ceramic Bonsai Pot - Blue Glazed',
        price: 40.0,
        quantity: 1,
        image:
          'https://images.unsplash.com/photo-1595137559919-4c064fbf5413?auto=format&fit=crop&w=1770&q=80',
      },
    ],
    tracking: {
      carrier: 'DHL',
      number: 'DH1234567890',
      events: [
        { date: '2023-09-05', time: '08:30', status: 'Order processed', location: 'Warehouse' },
        { date: '2023-09-06', time: '12:00', status: 'Shipped', location: 'Distribution Center' },
        { date: '2023-09-07', time: '09:20', status: 'Delivered', location: 'Customer Address' },
      ],
    },
  },
]


const selectedOrder = mockOrders[0] // temporary – will show first order

export default function OrderTrackingPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("id")
    const selectedOrder = mockOrders.find(o => o.id === orderId)


  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center">
      <main className="w-full max-w-5xl px-6 sm:px-10 lg:px-16 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight">Order Tracking</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Stay updated on your order’s journey.
          </p>
        </div>

        {/* Content */}
        {selectedOrder ? (
          <div className="space-y-10">
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <OrderDetails order={selectedOrder} />
            </section>

            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <OrderTracking trackingInfo={selectedOrder.tracking} />
            </section>
          </div>
        ) : (
          <div className="text-center py-20">
            <PackageIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Order Selected</h2>
            <p className="text-gray-500 mb-6">
              Please select an order from your history to track.
            </p>
            <Link href="/profile/order-history">
              <button className="px-6 py-2 bg-dark-brown text-main-white font-semibold rounded-md hover:bg-hover-dark-brown transition">
                View Order History
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
