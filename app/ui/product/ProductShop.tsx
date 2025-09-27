"use client";
import { useState } from "react";
import Search from "./Search";
import StyleFilter from "./StyleFilter";
import { bonsaiProducts } from "@/app/types/placeholder";
import BonsaiProduct from "./BonsaiProduct";
import { useAllProducts } from "@/app/lib/query/product-data";
import { CardSkeleton } from "@/components/ui/skeleton/skeleton";

export default function ProductShop() {
  const { data, isLoading, isError} = useAllProducts("/api/user");

  const [filters, setFilters] = useState({
      size: "",
      price: "",
      age: "", 
      care: "", 
      query: "" 
    });
  const [activeStyle, setActiveStyle] = useState("All Styles");
  const [sort, setSort] = useState("Featured");

  if(isLoading) return <CardSkeleton />
  if(isError) console.log("Error", isError);

  const products = data ?? [];

  let filteredProducts = products.filter((p) => {
    let inPriceRange = true;
    if (filters.price === "9999-18999") inPriceRange = p.price >= 9999 && p.price <= 18999;
    if (filters.price === "18999-24999") inPriceRange = p.price >= 18999 && p.price <= 24999;
    if (filters.price === "24999-34999") inPriceRange = p.price >= 24999 && p.price <= 34999;

    return (
      (filters.care ? p.bonsaiCareLevel === filters.care : true) &&
      (filters.age ? p.bonsaiAge === filters.age : true) &&
      (activeStyle !== "All Styles" ? p.bonsaiCategory === activeStyle : true) &&
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
          <BonsaiProduct
            productsData={filteredProducts}
          />
        </div>
      </div>
    </div>
  );
}
