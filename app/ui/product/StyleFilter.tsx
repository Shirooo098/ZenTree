"use client";
import { SlidersHorizontal } from "lucide-react";

type StyleFiltersProps = {
  activeStyle: string;
  setActiveStyle: (style: string) => void;
  sort: string;
  setSort: (value: string) => void;
  total: number;
  showing: number;
};

const styles = [
  "All Styles",
  "Formal Upright",
  "Informal Upright",
  "Slanting",
  "Cascade",
  "Semi-Cascade",
];

export default function StyleFilters({
  activeStyle,
  setActiveStyle,
  sort,
  setSort,

}: StyleFiltersProps) {
  
 const scrollToProducts = () => {
  const section = document.getElementById("shop-section");
  if (section) {
    const yOffset = -100;
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
};
  return (
    <>
      <div className="flex gap-3 flex-wrap pl-5 pb-5">
        {styles.map((style) => (
          <button
            key={style}
             onClick={() => {
              setActiveStyle(style);
              scrollToProducts(); 
            }}
            className={`px-5 py-2 rounded-lg border lg:w-[180px] h-[50px] mt-4 flex items-center justify-center gap-2 text-lg 
              ${activeStyle === style ? "bg-[#675D50] text-white" : "bg-gray-10 text-black"}
            `}
          >
            {style}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between py-3 text-sm pb-5">
      
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 font-semibold pl-4 text-lg">
            <SlidersHorizontal size={16} />
            Filter
          </button>
          {/* <span className="text-gray-600 ml-55 pl-75">
            Showing {showing} of {total} bonsai trees
          </span> */}
        </div>

      
        <div className="flex items-center gap-2 pr-13">
          <span className="text-gray-600">Sort by:</span>
          <select
            aria-label="Sort by"
            value={sort}
             onChange={(e) => {
              setSort(e.target.value);
              scrollToProducts(); 
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="Featured">Featured</option>
            <option value="PriceLowHigh">Price: Low to High</option>
            <option value="PriceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>
    </>
  );
}
