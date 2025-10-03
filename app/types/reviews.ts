// app/data/reviews.ts
export type Review = {
  id: number;
  productId: number;
  user: string;
  productQualityRating: number;
  comment: string;
  sellerServiceRating: number;
  deliveryServiceRating: number;
  date: string;
};

export const reviewsData: Review[] = [
  {
    id: 1,
    productId: 35,
    user: "Alice Tan",
    productQualityRating: 5,
    comment: "Beautiful bonsai, arrived in great condition! Easy to care for.",
    sellerServiceRating: 5,
    deliveryServiceRating: 5,
    date: "2025-09-15",
  },
  {
    id: 2,
    productId: 1,
    user: "Marco Santos",
    productQualityRating: 4,
    comment: "Lovely tree, though shipping took a bit longer than expected.",
    sellerServiceRating: 5,
    deliveryServiceRating: 5,
    date: "2025-09-20",
  },

];
