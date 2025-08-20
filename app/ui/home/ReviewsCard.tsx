import ReviewCard from "@/app/components/cards/Card"
import { ReviewsData } from "@/app/lib/placeholder"

export default function Reviews(){
    return(
        <>
            {ReviewsData.map((review) => {
                <ReviewCard
                    key={review.id}
                    id={review.id}
                    title={review.title}
                    description={review.description}
                    profile={review.profile}
                    author={review.author}
                    date={review.date}
                    stars={review.stars}
                />
            })}
        </>
    )
}