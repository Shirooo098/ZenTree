export const reviewsData: Review[] = [
  {
    id: 1,
    productId: 35,
    user: "Alice Tan",
    rating: 5,
    comment: "Beautiful bonsai, arrived in great condition! Easy to care for.",
    date: "2025-09-15",
  },
  {
    id: 2,
    productId: 1,
    user: "Marco Santos",
    rating: 4,
    comment: "Lovely tree, though shipping took a bit longer than expected.",
    date: "2025-09-20",
  },
  {
    id: 3,
    productId: 2,
    user: "Hannah Lee",
    rating: 5,
    comment: "Exceeded my expectations, the styling is amazing!",
    date: "2025-09-22",
  },
  {
    id: 4,
    productId: 2,
    user: "David Kim",
    rating: 3,
    comment: "Good bonsai, but the soil was a bit dry upon arrival.",
    date: "2025-09-25",
  },
];

// app/data/reviews.ts
export type Review = {
  id: number;
  productId: number;
  rating: number;
  user: string;
  comment: string;
  date: string;
};



