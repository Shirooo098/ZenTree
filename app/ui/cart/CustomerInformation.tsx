"use client";

import { CheckoutPageProps } from "./CheckoutPage";

export default function CustomerInformation({ userData }: CheckoutPageProps) {
  const firstName = userData.name?.split(" ")[0] || "";
  const lastName = userData.name?.split(" ")[1] || "";
  const email = userData.email || "";
  const phone = userData.phoneNumber || "";

  const isFilled = (value: string) => value.trim() !== "";

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm pb-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Customer Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1"> Name</label>
          <input
            type="text"
            defaultValue={firstName}
            disabled={isFilled(firstName)}
            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black ${
              isFilled(firstName) ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            defaultValue={lastName}
            disabled={isFilled(lastName)}
            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black ${
              isFilled(lastName) ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            defaultValue={email}
            disabled={isFilled(email)}
            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black ${
              isFilled(email) ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            defaultValue={phone}
            disabled={isFilled(phone)}
            className={`w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black ${
              isFilled(phone) ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}
