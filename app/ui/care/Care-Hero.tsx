"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CareHero() {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    image_url: "",
  });

useEffect(() => {
  fetch("/api/care-hero")
    .then((res) => res.json())
    .then((data) => {
      setHero({
        title: data?.title || "",
        description: data?.description || "",
        image_url: data?.image_url || "",
      });
    })
    .catch((err) => console.error("Failed to fetch Care Hero:", err));
}, []);


  return (
    <div className="relative flex h-[38vh] sm:h-[45vh] md:h-[60vh] justify-center items-center opacity-80">
      <Image
        src={hero.image_url || "/img/care.jpg"}
        alt="ZenTree Care Hero"
        fill
        priority
        loading="eager"
        className="object-cover opacity-80 z-0"
      />

      <div className="italic w-full z-10">
        <div className="flex items-center justify-start min-h-[60vh] bg-opacity-70 px-20">
          <div className="max-w-3xl text-left">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white">
              {hero.title || ""}
            </h1>

            <p className="mt-1 text-base sm:text-lg md:text-xl lg:text-1xl leading-relaxed text-white/90">
              {hero.description || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
