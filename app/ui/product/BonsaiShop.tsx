"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Search from "./Search";
import Image from "next/image";


type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Japanese Maple (Beginner)",
    description: "Chokkan – Formal Upright",
    price: 15000,
    image: "/img/banner.png",
  },
  {
    id: 2,
    name: "Japanese Maple (Intermediate)",
    description: "Chokkan – Formal Upright",
    price: 18000,
    image: "/img/banner.png",
  },
  {
    id: 3,
    name: "Japanese Maple (Pro)",
    description: "Chokkan – Formal Upright",
    price: 20000,
    image: "/img/banner.png",
  },
];

export default function BonsaiShop() {
  const [cart, setCart] = useState<Product[]>([]);
  const [notification, setNotification] = useState<string>("");

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);

    setNotification(`${product.name} added to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

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

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="product-container">
        <div className="filter">
          <Search />
        </div>
        <div className="card-wrapper">
          {products.map((p) => (
            <div key={p.id} className="card">
              <Image
                loading="eager"
                priority
                width={1000}
                height={1333}
                src={p.image}
                alt={p.name}
                className="object-cover rounded mx-auto mb-2"
              />
              <h3>{p.name}</h3>
              <p className="text-sm text-gray-500">{p.description}</p>
              <p>₱{p.price.toLocaleString()}</p>
 
              <Button
                size="sm"
                onClick={() => addToCart(p)}
                className="mx-auto mt-2 mb-4 flex justify-center"
              >
                Add To Cart
              </Button>

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
          ))}
        </div>
      </div>

      <div className="cart-counter mt-4">
        🛒 Cart: {cart.length} items (₱{cartTotal.toLocaleString()})
      </div>

      {notification && (
        <div
          id="cartNotification"
          className="cart-notification show mt-2 p-2 bg-green-200 rounded"
        >
          <span id="notificationText">{notification}</span>
        </div>
      )}
    </div>
  );
}
