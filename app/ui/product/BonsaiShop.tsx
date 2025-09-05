"use client";
import { useState } from "react";
import Search from "./Search";
import StyleFilter from "./StyleFilter";
import { bonsaiProducts } from "@/app/types/placeholder";
import BonsaiProduct from "./BonsaiProduct";



export default function BonsaiShop() {
  const [filters, setFilters] = useState({ size: "", price: "", age: "", care: "", query: "" });
  const [activeStyle, setActiveStyle] = useState("All Styles");
  const [sort, setSort] = useState("Featured");


  let filteredProducts = bonsaiProducts.filter((p) => {
    let inPriceRange = true;
    if (filters.price === "500-3000") inPriceRange = p.price >= 500 && p.price <= 3000;
    if (filters.price === "3000-15000") inPriceRange = p.price >= 3000 && p.price <= 15000;
    if (filters.price === "15000-250000") inPriceRange = p.price >= 15000 && p.price <= 250000;

    return (
      (filters.care ? p.care === filters.care : true) &&
      (filters.age ? p.age === filters.age : true) &&
      (activeStyle !== "All Styles" ? p.style === activeStyle : true) &&
      inPriceRange &&
      (filters.query ? p.name.toLowerCase().includes(filters.query.toLowerCase()) : true)
    );
  });


  if (sort === "PriceLowHigh") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "PriceHighLow") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }


  return (
    <div className="product-container">
      <StyleFilter
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
        sort={sort}
        setSort={setSort}
        total={bonsaiProducts.length}
        showing={filteredProducts.length}
      />

      <div className="flex">
      
        <div className="filter">
          <Search filters={filters} setFilters={setFilters} />
        </div>

        <div className="card-wrapper">
          <BonsaiProduct/>
        </div>
      </div>
    </div>
  );
}
