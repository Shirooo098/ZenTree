"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { addAddress } from "@/app/actions/address/add-address.action";
import { AddressState } from "@/app/types/address";
import { updateAddress } from "@/app/actions/address/update-address.action";
import { deleteAddress } from "@/app/actions/address/delete-address.action";
import Button from "@/app/ui/button";
import { useActionState } from "react";


interface Address {
  address_id: number;
  user_id: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  special_instructions?: string;
}

interface ShippingAddressProps {
  userId: string;
  initialAddresses: Address[];
}

export default function ShippingAddress({
  userId,
  initialAddresses,
}: ShippingAddressProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const [formState, setFormState] = useState({
    address: "",
    city: "",
    province: "",
    postal_code: "",
    special_instructions: "",
  });

  const [state, formAction] = useActionState(addAddress, {
  message: "",
  errors: {},
});

  const resetForm = () => {
    setFormState({
      address: "",
      city: "",
      province: "",
      postal_code: "",
      special_instructions: "",
    });
    setEditingId(null);
    setAddingNew(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const data = new FormData();
    data.append("user_id", userId);
    Object.entries(formState).forEach(([k, v]) => data.append(k, v));

    const result: AddressState = await addAddress(
      { errors: {}, message: null },
      data
    );

    if (result.message) {
      alert(result.message);
      setAddresses(await fetchAddresses());
      resetForm();
    }
  };

  const handleUpdate = async (addressId: number) => {
    const data = new FormData();
    data.append("address_id", addressId.toString());
    Object.entries(formState).forEach(([k, v]) => data.append(k, v));

    const result: AddressState = await updateAddress(data);

    if (result.message) {
      alert(result.message);
      setAddresses(await fetchAddresses());
      resetForm();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAddress(id);
    setAddresses(addresses.filter((a) => a.address_id !== id));
  };

  const fetchAddresses = async () => {
    const res = await fetch("/api/get-addresses?userId=" + userId); // optional API route
    return await res.json();
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.address_id);
    setFormState({
      address: addr.address,
      city: addr.city,
      province: addr.province,
      postal_code: addr.postal_code || "",
      special_instructions: addr.special_instructions || "",
    });
  };

  return (
    <div>
      <div className="flex justify-between pb-2">
        <h2 className="font-bold text-2xl">Shipping Address</h2>
        {!addingNew && (
          <button
            onClick={() => setAddingNew(true)}
            className="flex items-center gap-1 p-1 font-semibold text-blue-600 text-xs hover:underline"
          >
            <Plus size={16} /> Add New Address
          </button>
        )}
      </div>

      {/* Add New Address Form */}
      {addingNew && (
        <form
          action={formAction}
          className="rounded-xl mt-4 p-5 bg-gray-100 shadow-sm space-y-2"
        >
          <h3 className="font-semibold mb-3">Add New Address</h3>

          {/* Hidden field for user ID */}
          <input type="hidden" name="user_id" value={userId} />

          <input
            name="address"
            placeholder="Street/Address"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="city"
            placeholder="City"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="province"
            placeholder="Province"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="postal_code"
            placeholder="Postal Code"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="special_instructions"
            placeholder="Special Instructions"
            className="w-full p-2 border rounded"
          />

          <div className="flex justify-end gap-2 mt-3">
            <Button type="button" variant="secondary"  onClick={resetForm} className="px-3 py-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="px-3 py-2">
              Add Address
            </Button>
          </div>
        </form>
      )}

      {/* Address List */}
      {addresses.map((addr) => (
        <div
          key={addr.address_id}
          className="rounded-xl mt-5 p-5 bg-gray-100 shadow-sm"
        >
          {editingId === addr.address_id ? (
            <div className="space-y-2">
              <input
                name="address"
                placeholder="Street/Address"
                value={formState.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="city"
                placeholder="City"
                value={formState.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="province"
                placeholder="Province"
                value={formState.province}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="postal_code"
                placeholder="Postal Code"
                value={formState.postal_code}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <textarea
                name="special_instructions"
                placeholder="Special Instructions"
                value={formState.special_instructions}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="secondary" className="px-3 py-2" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  variant="primary" className="px-3 py-2"
                  onClick={() => handleUpdate(addr.address_id)}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-gray-600" />
                  <p className="font-bold text-lg text-gray-700">
                    {addr.address} {addr.city}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => startEdit(addr)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.address_id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                  > 
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 pl-7 text-gray-700 space-y-1">
                <p>
                  <span className="font-semibold">Street:</span> {addr.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {addr.city}
                </p>
                <p>
                  <span className="font-semibold">Province:</span>{" "}
                  {addr.province}
                </p>
                {addr.postal_code && (
                  <p>
                    <span className="font-semibold">Postal Code:</span>{" "}
                    {addr.postal_code}
                  </p>
                )}
                {addr.special_instructions && (
                  <p>
                    <span className="font-semibold">Instructions:</span>{" "}
                    {addr.special_instructions}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
