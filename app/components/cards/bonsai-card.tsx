"use client";

import { BonsaiProps } from "@/app/types/definition";
<<<<<<< HEAD
import { Dot } from 'lucide-react'
=======
import { Dot, Heart } from "lucide-react";
>>>>>>> faedfe743e5c6b05dcb88f7d3966029dd23dc285
import { ManRope } from "@/app/ui/fonts";
import { toast } from "sonner";
import { Image, ImageKitProvider } from "@imagekit/next";
import Link from "next/link";

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

const addToCartNotif = () => {
<<<<<<< HEAD
    toast('Product Added To Cart.');
}

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
=======
  toast("Product Added To Cart.");
};

export default function BonsaiCard({
  id,
  name,
  care,
  style,
  price,
  age,
  imageUrl,
}: BonsaiProps) {
  return (
    <div className="card">
      <p className="hidden">{id}</p>
      <ImageKitProvider urlEndpoint={imageUrl}>
        <Image
          loading="eager"
          priority
          width={1000}
          height={1333}
          src={imageUrl}
          alt={name}
          className="object-cover rounded-[2px] mx-auto mb-2 h-100"
        />
      </ImageKitProvider>

      <span
        id={`heart-${id}`}
        className="heart-icon cursor-pointer ml-2"
        onClick={() => toggleHeart(id)}
      >
        <Heart />
      </span>

      <div className={`${ManRope.className} p-4 capitalize`}>
        <div className="flex justify-between text-lg text-dark-brown">
          <h3 className="truncate">{name}</h3>
          <h3>₱{price.toLocaleString()}</h3>
        </div>

        <p className="font-semibold">{care}</p>

        <div className="text-gray-600 mt-4 flex justify-between items-center text-base">
          <div className="inline-flex">
            <p>{style}</p>
            <Dot />
            <p>{age}</p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="capitalize rounded-xs"
            onClick={addToCartNotif}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
>>>>>>> faedfe743e5c6b05dcb88f7d3966029dd23dc285
