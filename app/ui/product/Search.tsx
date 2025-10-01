"use client";

import { SearchBar } from "@/app/components/search/SearchBar";

type SearchProps = {
  filters: {
    size: string;
    price: string;
    age: string;
    care: string;
    query: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      size: string;
      price: string;
      age: string;
      care: string;
      query: string;
    }>
  >;
};


export default function Search({ filters, setFilters }: SearchProps) {
  return (
    <div className=" bg-gray-100 rounded-md p-4">
      <h2 className="font-bold">Search Product    

      <button
        className="mt-4 text-sm text-black no-underline pl-10 opacity-50 c"
        onClick={() => setFilters({ size: "", price: "", age: "", care: "", query: ""})}
      >
        Reset
      </button>
      </h2>
    <SearchBar filters={filters} setFilters={setFilters} />
      <span className="price1 ">Price Range</span>
      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="price"
          value="9999-18999"
          checked={filters.price === "9999-18999"}
          onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
        />
        <span>₱ 9,999 - 18,999</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="price"
          value="18999-24999"
          checked={filters.price === "18999-24999"}
          onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
        />
        <span>₱ 18,999 - 24,999</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="price"
          value="24999-Infinity"
          checked={filters.price === "24999-Infinity"}
          onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
        />
        <span>₱ 24,999 and above</span>
      </label>
      
      <br />

      <span className="age1">Age</span>
      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="age"
          value="Young"
          checked={filters.age === "Young"}
          onChange={(e) => setFilters((f) => ({ ...f, age: e.target.value }))}
        />
        <span>Young (1-10 years)</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="age"
          value="Mature"
          checked={filters.age === "Mature"}
          onChange={(e) => setFilters((f) => ({ ...f, age: e.target.value }))}
        />
        <span>Mature (11-20 years)</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="age"
          value="Aged"
          checked={filters.age === "Aged"}
          onChange={(e) => setFilters((f) => ({ ...f, age: e.target.value }))}
        />
        <span>Aged (20+ years)</span>
      </label>

      <br />

      <span className="care1">Care Level</span>
      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="care"
          value="Beginner"
          checked={filters.care === "Beginner"}
          onChange={(e) => setFilters((f) => ({ ...f, care: e.target.value }))}
        />
        <span>Beginner</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="care"
          value="Intermediate"
          checked={filters.care === "Intermediate"}
          onChange={(e) => setFilters((f) => ({ ...f, care: e.target.value }))}
        />
        <span>Intermediate</span>
      </label>

      <label className="flex items-center space-x-2 mb-2 cursor-pointer">
        <input
          type="radio"
          name="care"
          value="Advanced"
          checked={filters.care === "Advanced"}
          onChange={(e) => setFilters((f) => ({ ...f, care: e.target.value }))}
        />
        <span>Advanced</span>
      </label>
    </div>
  );
}
