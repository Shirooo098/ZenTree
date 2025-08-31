"use client";


import { useState } from "react";
import { SearchBar } from "@/app/components/search/SearchBar";


export default function Search() {
  const [selected, setSelected] = useState("");

  return (
   <>
    <div className="p-4">
      <h2 className="mb-4  font-bold">Search Product</h2>
      <SearchBar />

      <span className="">Sizes</span>
      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="fruit"
          onChange={(e) => setSelected(e.target.value)}
          className="custom-radio"
        />
        <span>Keshitsubo (1in. - 3in.)</span>
      </label>

      <label className="flex items-center space-x-2 mb-2">
        <input
          type="radio"
          name="fruit"
          onChange={(e) => setSelected(e.target.value)}
          className="custom-radio"
        />
        <span>Banana</span>
      </label>

      <label className="flex items-center space-x-2 mb-2">
        <input
          type="radio"
          name="fruit"
          value="mango"
          onChange={(e) => setSelected(e.target.value)}
          className="custom-radio"
        />
        <span>Mango</span>
      </label>
    </div>
   </>
  );
}
