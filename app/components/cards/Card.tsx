import { ReviewCardProps } from "@/app/types/definition";

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
            <h4>{title}</h4>
            <p>{id}</p>
            <p>{description}</p>
            <div>
                <div>
                    <p>{profile}</p>
                </div>
                <p>{author}</p>
                <p>{date}</p>
            </div>
            <div>{stars}</div>
        </>
    )
}