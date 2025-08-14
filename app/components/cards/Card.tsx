import { ReviewCardProps } from "@/app/types/definition";

export default function ReviewCard({
    title,
    description,
    author,
    date,
}: ReviewCardProps){
    return(
        <>
            <h4>{title}</h4>
            <p>{description}</p>
            <div>
                <p>{author}</p>
                <p>{date}</p>
            </div>

        </>
    )
}