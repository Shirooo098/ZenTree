"use client";

import { useState, useEffect } from "react";

interface Address {
  address_id: number;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  special_instructions: string | null;
}

interface ShippingAddressProps {
  userAddress?: Address | null;
}

export default function ShippingAddress({ userAddress }: ShippingAddressProps) {
  const hasAddress = !!userAddress;

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    province: "",
    postal_code: "",
    special_instructions: "",
  });

  // 🩵 Sync formData when userAddress updates
  useEffect(() => {
    if (userAddress) {
      setFormData({
        address: userAddress.address || "",
        city: userAddress.city || "",
        province: userAddress.province || "",
        postal_code: userAddress.postal_code || "",
        special_instructions: userAddress.special_instructions || "",
      });
    }
  }, [userAddress]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mt-5">
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>

        <div className="space-y-4">
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={hasAddress ? undefined : handleChange}
            readOnly={hasAddress}
            disabled={hasAddress}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={hasAddress ? undefined : handleChange}
              readOnly={hasAddress}
              disabled={hasAddress}
              className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
            />
            <input
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={hasAddress ? undefined : handleChange}
              readOnly={hasAddress}
              disabled={hasAddress}
              className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
            />
            <input
              name="postal_code"
              placeholder="Postal Code (1850)"
              value={formData.postal_code || ""}
              onChange={hasAddress ? undefined : handleChange}
              readOnly={hasAddress}
              disabled={hasAddress}
              className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
            />
          </div>

          <textarea
            name="special_instructions"
            rows={2}
            placeholder="Special Instructions (Optional)"
            value={formData.special_instructions}
            onChange={hasAddress ? undefined : handleChange}
            readOnly={hasAddress}
            disabled={hasAddress}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
          ></textarea>
        </div>

        {!hasAddress && (
          <button
            type="submit"
            className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Save Shipping Address
          </button>
        )}
      </div>
    </form>
  );
}
