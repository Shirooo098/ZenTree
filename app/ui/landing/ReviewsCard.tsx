import ReviewCard from "@/app/components/cards/review-card"
import { ReviewsData } from "@/app/lib/placeholder"

export default function RecentReviews(){
    return(
        <>
            {ReviewsData.map((review) => {
                return(
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
                )
            })}
        </>
    )
}