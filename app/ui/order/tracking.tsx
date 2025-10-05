'use client'
import React from 'react'
import { TruckIcon, CheckCircleIcon } from 'lucide-react'

interface OrderTrackingProps {
  trackingInfo: {
    carrier: string
    number: string
    events: Array<{
      date: string
      time: string
      status: string
      location: string
    }>
  }
}

export const OrderTracking = ({ trackingInfo }: OrderTrackingProps) => {
  const formatDateTime = (dateString: string, timeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }
    const date = new Date(`${dateString}T${timeString}`)
    return date.toLocaleString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center">
      <main className="container mx-auto px-4 pt-24 pb-10 flex flex-col p-[100px] w-full max-w-4xl">
        {/* Title Section */}
        <div className="flex flex-col mb-6 space-y-2 justify-center items-center mt-10">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <TruckIcon size={20} className="text-green-700" />
            </div>
            <h1 className="text-3xl font-bold text-center">Order Tracking</h1>
          </div>
          <p className="text-gray-600">
            {trackingInfo.carrier} — {trackingInfo.number}
          </p>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 w-full">
          <div className="space-y-8 relative">
            {/* Timeline vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {trackingInfo.events.map((event, index) => (
              <div key={index} className="flex items-start relative">
                <div
                  className={`h-6 w-6 flex items-center justify-center rounded-full border-2 ${
                    index === 0
                      ? 'bg-green-100 border-green-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {index === 0 && (
                    <CheckCircleIcon size={14} className="text-green-700" />
                  )}
                </div>
                <div className="ml-6">
                  <div
                    className={`font-semibold ${
                      index === 0 ? 'text-green-700' : 'text-gray-800'
                    }`}
                  >
                    {event.status}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(event.date, event.time)}
                  </div>
                  <div className="text-sm text-gray-400">{event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
