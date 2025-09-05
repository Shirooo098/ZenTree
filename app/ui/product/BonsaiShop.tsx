"use client";
import { useState } from "react";
import Search from "./Search";
import StyleFilter from "./StyleFilter";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  care: string;
  style: string;
  price: number;
  age: string;
  image: string;
};

const products: Product[] = [
  { id: 1, name: "Japanese Maple (Beginner)", care: "Beginner", style: "Formal Upright", price: 15000, age: "Mature", image: "/img/bonsai-3.jpg" },
  { id: 2, name: "Sakura Tree (Intermediate)", care: "Intermediate", style: "Informal Upright", price: 18000, age: "Young", image: "/img/bonsai-2.jpg" },
  { id: 3, name: "Japanese Yen (Advanced)", care: "Advanced", style: "Slanting", price: 20000, age: "Aged", image: "/img/bonsai-1.jpg" },
  { id: 4, name: "Bamboo (Advanced)", care: "Advanced", style: "Cascade", price: 25000, age: "Mature", image: "/img/bonsai-5.jpg" },
  { id: 5, name: "Japanese Yen (Beginner)", care: "Beginner", style: "Semi-Cascade", price: 20000, age: "Aged", image: "/img/bonsai-4.jpg" },
];

export default function BonsaiShop() {
  const [filters, setFilters] = useState({ size: "", price: "", age: "", care: "", query: "" });
  const [activeStyle, setActiveStyle] = useState("All Styles");
  const [sort, setSort] = useState("Featured");


  let filteredProducts = products.filter((p) => {
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

  const toggleHeart = (id: number) => {
    const heart = document.getElementById(`heart-${id}`) as HTMLElement;
    if (!heart) return;

    const path = heart.querySelector("path") as SVGPathElement;
    if (path.getAttribute("fill") === "red") {
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#6b7280");
    } else {
      path.setAttribute("fill", "red");
      path.setAttribute("stroke", "red");
    }
  };

  return (
    <div className="product-container">
      <StyleFilter
        activeStyle={activeStyle}
        setActiveStyle={setActiveStyle}
        sort={sort}
        setSort={setSort}
        total={products.length}
        showing={filteredProducts.length}
      />

      <div className="flex">
      
        <div className="filter">
          <Search filters={filters} setFilters={setFilters} />
        </div>

        <div className="card-wrapper">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} className="card">
                
                <Image
                  loading="eager"
                  priority
                  width={1000}
                  height={1333}
                  src={p.image}
                  alt={p.name}
                  className="object-cover rounded-[2px] mx-auto mb-2 h-80"
                />

                <div className="absolute bottom-23 left-6 bg-white w-auto h-10 rounded-sm text-center p-2 font-semibold">
                  {p.care}
                </div>

                <div className="flex justify-between items-center mx-3 text-lg">
                  <h3>{p.name}</h3>
                  <h3> <p>₱ {p.price.toLocaleString()}</p> </h3>
                </div>
              
                <p className=" text-gray-600 ml-3 pb-4 flex items-center text-base">{p.style} 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dot-icon lucide-dot"><circle cx="12.1" cy="12.1" r="1"/></svg>
                   {p.age}</p>
                

                <span
                  id={`heart-${p.id}`}
                  className="heart-icon cursor-pointer ml-2"
                  onClick={() => toggleHeart(p.id)}
                >
                  <svg
                    fill="none"
                    stroke="#6b7280"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935
                       0-3.597 1.126-4.312 2.733C11.597 4.876
                       9.935 3.75 8 3.75 5.401 3.75 3.375
                       5.765 3.375 8.25c0 7.22 8.625
                       11.25 8.625 11.25S21 15.47 21 8.25z"
                    />
                  </svg>
                </span>
              </div>
            ))
          ) : (
            <p>No products match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
