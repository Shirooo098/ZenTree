"use client";

import { Loader } from "@/app/components/loader/loader";
import { useUserProductId } from "@/app/lib/query/product-data";
import { ImageKitProvider, Image } from "@imagekit/next";
import { useParams } from "next/navigation";
import { MoveLeft } from 'lucide-react';
import Link from 'next/link'

export default function ProductId() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading, isError } = useUserProductId(productId);

  if (isLoading)
    return (
      <div className="size-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  if (isError) return console.log("Error", isError);

  if (!product) {
    return (
      <div className="size-screen flex justify-center items-center">
        <p>Product not found</p>
      </div>
    );
  }
  console.log(product);
  return (
    <div className="h-[1000px] flex flex-col justify-center items-center">
     
      <div className="w-full flex justify-start px-60 gap-25">
        <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_id">
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

        <div>
            <div className="flex items-center juustify-between w-full gap-88">
                <p className="inline-block bg-dark-brown text-white py-1 rounded px-5">
                    {product.bonsaiCareLevel}
                </p>
                 <Link href="/product" className="flex items-center gap-2 cursor-pointer  text-black hover:text-gray-300 ">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                        <MoveLeft className="w-4 h-4" />
                    </span>
                    <span>back to start</span>
                    </Link>
            </div>


            <p className="text-7xl">{product.name}</p>
            <p className="text-5xl pt-5"> ₱ {product.price}</p>
            <p className="pt-3">In stock: only {product.stock} remaining.</p>
        </div>
      </div>
    </div>
  );
}
