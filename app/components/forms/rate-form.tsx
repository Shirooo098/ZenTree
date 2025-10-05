"use client";
import { useState } from "react";
import { FaLeaf, FaRegImage } from "react-icons/fa";

export default function RateForm() {
  const [productRating, setProductRating] = useState(4);
  const [sellerRating, setSellerRating] = useState(4);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [review, setReview] = useState("");

  const renderLeaves = (rating: number, setRating: (val: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FaLeaf
            key={i}
            onClick={() => setRating(i + 1)}
            className="cursor-pointer text-2xl"
            style={{ color: i < rating ? "#675d50" : "#d1d5db" }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto border p-6 rounded-md shadow-md">
      <h2 className="text-center text-lg font-bold mb-6">Rate our Product</h2>

      {/* Product Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src="/img/bonsai-1.jpg"
          alt="Product"
          className="w-16 h-16 rounded object-cover"
        />
        <div>
          <h3 className="font-semibold">JAPANESE MAPLE - INTERMEDIATE</h3>
          <p className="text-sm text-gray-500">Chokkan Formal Upright</p>
        </div>
      </div>

      {/* Product Quality */}
      <div className="mb-6">
        <p className="font-medium">Product Quality</p>
        <div className="flex items-center gap-2">
          {renderLeaves(productRating, setProductRating)}
          <span className="ml-2 text-green-600 font-medium">
            {productRating >= 5
              ? "Excellent"
              : productRating >= 4
                ? "Good"
                : productRating >= 3
                  ? "Fair"
                  : "Poor"}
          </span>
        </div>
      </div>

      {/* Review Box */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about our product."
          className="w-full h-28 border rounded-md p-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* About Service */}
      <div className="mb-6">
        <p className="font-medium mb-3">About Service</p>

        {/* Seller Service */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-32 font-medium">Seller Service</span>
          {renderLeaves(sellerRating, setSellerRating)}
          <span className="ml-2 text-green-600 font-medium">
            {sellerRating >= 5
              ? "Excellent"
              : sellerRating >= 4
                ? "Good"
                : sellerRating >= 3
                  ? "Fair"
                  : "Poor"}
          </span>
        </div>

        {/* Delivery Service */}
        <div className="flex items-center gap-2">
          <span className="w-32 font-medium">Delivery Service</span>
          {renderLeaves(deliveryRating, setDeliveryRating)}
          <span className="ml-2 text-green-600 font-medium">
            {deliveryRating >= 5
              ? "Excellent"
              : deliveryRating >= 4
                ? "Good"
                : deliveryRating >= 3
                  ? "Fair"
                  : "Poor"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button className="text-gray-600 hover:underline">Cancel</button>
        <button className="px-6 py-2 bg-[#675d50] text-white rounded-md hover:bg-[#53493f] transition">
          Submit
        </button>
      </div>
    </div>
  );
}
