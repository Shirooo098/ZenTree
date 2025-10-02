"use client";

import { useAddToCart } from "@/app/lib/query/cart/cart-data";
import { useUserProductId } from "@/app/lib/query/product-data";
import { ImageKitProvider, Image } from "@imagekit/next";
import { useParams } from "next/navigation";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import Button from "@/app/ui/button";
import { useState } from "react";

export default function ProductId() {
    const { id } = useParams<{ id: string }>();
    const prodId = Number(id)

    const {data: product, isLoading, isError } = useUserProductId(prodId)
    const addToCartMutation = useAddToCart();
    const [quantity, setQuantity] = useState<number>(1);

    if (!product) return <div>Product not found</div>
       
    const decrease = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const increase = () => {
    setQuantity(prev => prev + 1);
    };

    if (isError) return <div>Error loading product!</div>

  return (
      <div className="h-[100vh] flex flex-col justify-center items-center size-screen pt-40">
            <div className="w-2/3 flex justify-center gap-20 ">
              <ImageKitProvider urlEndpoint={product.image_url}>
                <Image
                  loading="eager"
                  priority
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="object-cover rounded-md mb-2 "
                />
              </ImageKitProvider>
              <div className="w-1/2">
                <div className="flex items-center justify-between w-full">
                  <p className="inline-block bg-dark-brown text-white py-1 rounded px-5">
                    {product.bonsaiCareLevel}
                  </p>
                  <Link
                    href="/product"
                    className="flex items-center gap-2 cursor-pointer  text-black hover:text-gray-300 "
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      <MoveLeft className="w-4 h-4" />
                    </span>
                    <span>back to start</span>
                  </Link>
                </div>
                <div className="w-full pb-5">
                  <p className="text-7xl font-serif pt-2">{product.name}</p>
                  <p className="text-5xl pt-5"> ₱ {product.price}</p>
                  <p className="pt-3">
                    In stock: only {product.stock} remaining.
                  </p>
                </div>
                <div className="bg-gray-100 py-5 px-8 ">
                  <span className="font-bold font-serif">Description</span>
                  <p className="text-justify w-full border-t-2 border-gray-400 my-2 ">
                    {product.description}
                  </p>
                </div>
                <div className="pt-5 w-full flex gap-3">
                  <div className="flex items-center border rounded overflow-hidden w-24">
                    <button
                      onClick={decrease}
                      className="px-1.5 py-1 text-lg font-bold border-r hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button
                      onClick={increase}
                      className="px-1.5 py-1 text-lg font-bold border-l hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled={addToCartMutation.isPending}
                    onClick={() => addToCartMutation.mutate({ productId: prodId, quantity})} 
                    className="capitalize rounded-xs w-1/2"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="capitalize rounded-xs w-1/2"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
        </div>
    )
}