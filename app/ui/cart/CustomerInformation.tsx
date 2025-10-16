"use client";

import { CheckoutPageProps } from "./CheckoutPage";


export default function CustomerInformation({ userData }: CheckoutPageProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm pb-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            defaultValue={userData.name?.split(" ")[0] || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            defaultValue={userData.name?.split(" ")[1] || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            defaultValue={userData.email}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            defaultValue={userData.phoneNumber || ""}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}
