import React from 'react'
import { PackageIcon } from 'lucide-react'

interface OrderDetailsProps {
  order: any
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="bg-white backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 bg-dark-brown/10 rounded-full flex items-center justify-center">
          <PackageIcon size={20} className="text-dark-brown" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-black">Order Details</h2>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
        </div>
      </div>

      {/* Order Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="font-medium text-black">{order.id}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Date Placed</p>
          <p className="font-medium text-black">{formatDate(order.date)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="font-medium text-dark-brown">${order.total.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <div className="mt-1">
            <span className="px-3 py-1 rounded-full text-xs text-main-white bg-dark-brown hover:bg-hover-dark-brown transition-colors">
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Items */}
      <h3 className="font-semibold text-lg text-black mb-4">Items in this order</h3>
      <div className="space-y-4 mb-6">
        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 object-cover rounded-md border border-gray-200"
            />
            <div className="flex-1">
              <h4 className="text-black font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">Premium Collection</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                <span className="text-dark-brown font-semibold">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end">
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-black">
                $
                {order.items
                  .reduce(
                    (total: number, item: any) =>
                      total + item.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-black">$12.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="text-black">$6.45</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="font-semibold text-black">Total</span>
              <span className="font-bold text-dark-brown">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
