import ProductShop from "@/app/ui/product/ProductShop";
import TopBanner from "./../../ui/product/TopBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Product',
};


export default function Product() {
  return (
    <>
      <TopBanner />
      <ProductShop />
    </>
  );
}
