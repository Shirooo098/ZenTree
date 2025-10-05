import { reviewsData } from "@/app/types/reviews";
import { FaLeaf } from "react-icons/fa";

export default function Reviews() {
  // helper to render leaf rating
  const renderLeaves = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaLeaf 
  key={i}
  className={`w-4 h-4`}
  style={{ color: i < rating ? "#675d50" : "#d1d5db" }} // gray-300 = #d1d5db
/>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
      {reviewsData.length > 0 ? (
        reviewsData.map((review) => (
          <div key={review.id} className="border p-3 rounded mb-3 shadow-sm">
            <p className="font-bold">{review.user}</p>

            <p className="font-medium">Product Quality</p>
            {renderLeaves(review.productQualityRating)}

            <p className="font-medium">Seller Service</p>
            {renderLeaves(review.sellerServiceRating)}

            <p className="font-medium">Delivery Service</p>
            {renderLeaves(review.deliveryServiceRating)}

            <p className="mt-2">{review.comment}</p>
            <span className="text-gray-500 text-sm">{review.date}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}
