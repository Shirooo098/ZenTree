import React from 'react'
import { PackageIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from "next/navigation"


interface OrderCardProps {
  order: any
  onSelect: () => void
}

export const OrderCard = ({ order, onSelect }: OrderCardProps) => {
  const router = useRouter()
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-600 border-green-300'
      case 'shipped':
        return 'bg-blue-100 text-blue-600 border-blue-300'
      case 'processing':
        return 'bg-yellow-100 text-yellow-600 border-yellow-300'
      case 'cancelled':
        return 'bg-red-100 text-red-600 border-red-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:border-green-400/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
      onClick={onSelect}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <PackageIcon size={20} className="text-cyan-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Order #{order.id}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(order.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-semibold text-green-600">
                ${order.total.toFixed(2)}
              </p>
            </div>
            <ChevronRightIcon size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-10 w-10 object-cover rounded-md"
                />
                <div>
                  <p className="text-sm text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Button Section (Track Order Button) */}
              <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/profile/order-tracking?id=${order.id}`)
          }}
          className="px-4 py-2 text-sm rounded-md transition-colors border-none bg-dark-brown text-main-white hover:bg-hover-dark-brown"
        >
          Track Order
        </button>
        </div>
      </div>
    </div>
  )
}
