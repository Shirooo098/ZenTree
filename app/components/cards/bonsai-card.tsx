"use client";

import { BonsaiProps } from "@/app/types/definition";
import { Dot } from 'lucide-react'
import { ManRope } from "@/app/ui/fonts";
import { Image, ImageKitProvider } from "@imagekit/next";
import Link from "next/link";


export default function BonsaiCard({
    id,
    name,
    care,
    style,
    price,
    age,
    imageUrl
}: BonsaiProps){

    return(
       <Link href={`/product/${id}`} className="size-full">
            <article className="relative h-full flex flex-col rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <p className="hidden">{id}</p>
                
                <div className="flex flex-col items-center w-full bg-gray-100 overflow-hidden flex-shrink-0">
                    <ImageKitProvider urlEndpoint={imageUrl}>
                        <Image
                            loading="eager"
                            priority
                            width={1000}
                            height={600}
                            src={`${imageUrl}`}
                            alt={name}
                            className="aspect-[4/3] object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </ImageKitProvider>
                </div>

                <div className={`${ManRope.className} p-4 flex flex-col flex-grow`}>
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-lg text-dark-brown capitalize line-clamp-1 flex-1">
                            {name}
                        </h3>
                        <h3 className="text-lg text-dark-brown font-semibold whitespace-nowrap">
                            ₱{price.toLocaleString()}
                        </h3>
                    </div>

                    <p className="font-semibold text-base capitalize mb-3">
                        {care}
                    </p>

                    <div className="text-gray-600 flex items-center text-sm mt-auto">
                        <span className="capitalize">{style}</span>
                        <Dot className="flex-shrink-0" />
                        <span className="capitalize">{age}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
