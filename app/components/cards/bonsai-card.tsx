import { BonsaiProps } from "@/app/types/definition";
import Image from 'next/image';
import { Dot, Heart } from 'lucide-react'
import { ManRope } from "@/app/ui/fonts";
import Button from "@/app/ui/button";

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


export default function BonsaiCard({
    id,
    name,
    care,
    style,
    price,
    age,
    image
}: BonsaiProps){
    return(
        <div className="card">
            <p className="hidden">{id}</p>
            <Image
                loading="eager"
                priority
                width={1000}
                height={1333}
                src={image}
                alt={name}
                className="object-cover rounded-[2px] mx-auto mb-2 h-80"
            />
            
            <span 
                id={`heart-${id}`}
                className="heart-icon cursor-pointer ml-2"
                 onClick={() => toggleHeart(id)}
            >
                <Heart/>
            </span>

            <div className={`${ManRope.className} p-4 capitalize `}>
                <div className="flex justify-between text-lg text-dark-brown">
                    <h3>{name}</h3>
                    <h3>₱{price.toLocaleString()}</h3>
                </div>

                <p className="font-semibold">{care}</p>

                <div className="text-gray-600 mt-4 flex justify-between items-center text-base">
                    <div className="inline-flex">
                        <p>{style}</p>
                        <Dot />
                        <p>{age}</p>
                    </div>

                    <Button variant="primary" size="md"  className="capitalize rounded-xs">Add to Cart</Button>
                </div>
            </div>
        </div>
    )
}