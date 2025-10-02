"use client";

import { Loader } from "@/app/components/loader/loader";
import { useUserProductId } from "@/app/lib/query/product-data";
import Button from "@/app/ui/button";
import { ImageKitProvider,Image } from "@imagekit/next";
import { useParams } from "next/navigation";


export default function ProductId(){
    const {id} = useParams<{ id: string }>();
    const productId = Number(id)

    const {data: product, isLoading, isError } = useUserProductId(productId)

    if(isLoading) return <div className="size-screen flex justify-center items-center"><Loader/></div>
    if(isError) return console.log("Error", isError)

    if (!product) {
        return (
            <div className="size-screen flex justify-center items-center">
                <p>Product not found</p>
            </div>
        );
    }
    console.log(product)
    return(
        <div className="h-[1000px] flex flex-col justify-center items-center">
            <p>Product Id: {product.id}</p>
            <p>Product Name: {product.name}</p>
            <div>
                Image:
                  <ImageKitProvider urlEndpoint={product.image_url}>
                    <Image
                        loading="eager"
                        priority
                        width={1000}
                        height={1333}
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover rounded-[2px] mx-auto mb-2 h-80"
                    />
                </ImageKitProvider>
            </div>
            <Button variant='primary'>Add To Cart</Button>
        </div>
    )
}