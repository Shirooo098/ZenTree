'use client'
import React from 'react'
import { OrderCard } from '@/app/ui/order/ordercard'
import { ClockIcon } from 'lucide-react'
import Link from 'next/link'

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


export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center">
      <main className="container mx-auto px-4 pt-24 pb-5 flex flex-col p-[100px] w-full max-w-4xl">
        {/* Title Section */}
        <div className="flex flex-col mb-2 space-y-4 justify-center items-center mt-10">
          <h1 className="text-3xl font-bold text-center">Order History</h1>
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 gap-8 w-full">
          {mockOrders.map((order) => (
            <div key={order.id} className="p-6 bg-white rounded-xl shadow-sm">
              <OrderCard order={order} onSelect={() => {}} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
