"use client";
import { DMSans } from "../fonts";
import Button from "../button";
import { MoveRight } from "lucide-react";
import Image from "next/image";

export default function TopBanner() {
  const scrollToShop = () => {
  const section = document.getElementById("shop-section");
  if (section) {
    const yOffset = -110; 
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

  return (
    <div className="container">
      <div className="hero">
        <h1 className="product-hero">Discover the Art of</h1>
        <h1 className="text">Bonsai</h1>

        <p className="text1">
          Bring harmony and tranquility into your space with our carefully
          cultivated bonsai trees. Each tree is a miniature work of art,
          thoughtfully nurtured to foster a peaceful, balanced atmosphere in any
          environment.
        </p>

        <Button
          variant="secondary"
          size="lg"
          onClick={scrollToShop}
          className={`${DMSans.className} capitalize text-calm-green px-6 py-3 lg:w-[250px] mt-5 flex items-center justify-center gap-2`}
        >
          Shop Collection
          <MoveRight className="w-9 h-10" />
        </Button>
      </div>

      <div className="img-banner">
        <Image
          className="banner"
          src="/img/banner.png"
          alt="Banner"
          width={383}
          height={550}
        />
      </div>
    </div>
  );
}
