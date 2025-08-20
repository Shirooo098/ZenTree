import { ReviewCardProps } from "@/app/types/definition";
import { ManRope } from "@/app/ui/fonts";
import Image from 'next/image';

export default function ReviewCard({
    id,
    title,
    description,
    profile,
    author,
    date,
    stars,
}: ReviewCardProps){
    return(
        <>
            <div className={`${ManRope.className} flex flex-col col-span-1 row-span-1 relative`}>
                <h4 className="font-bold text-lg sm:text-xl lg:text-2xl">{title}</h4>
                <p className="hidden">{id}</p>
                <p className="capitalize inline-block mt-2 text-base line-clamp-3">{description}</p>
                <div className="flex mt-2">
                    <Image
                        src={profile}
                        alt={author}
                        height={50}
                        width={50}
                        className="object-contain rounded-full size-auto"
                    />
                    <div className="flex flex-col justify-center ml-5">
                        <p className="font-semibold">{author}</p>
                        <p className="text-gray-500">{date}</p>
                    </div>
                </div>
                <div className="mt-2">{stars}</div>
            </div>
        </>
    )
}