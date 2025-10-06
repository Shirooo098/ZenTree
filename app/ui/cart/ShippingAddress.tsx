"use client";

export default function ShippingAddress() {
  return (
    <>
      <form className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm mt-5">
                <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Address"
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["City", "Province", "Postal Code"].map((field) => (
                      <input
                        key={field}
                        placeholder={field}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                      />
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Special Instructions (Optional)"
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-black"
                  ></textarea>
                </div>
              </div>
      </form>
    </>
  );
}
