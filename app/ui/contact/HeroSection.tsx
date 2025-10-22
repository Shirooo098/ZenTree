"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeroSection() {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetch("/api/contact-hero")
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Failed to fetch contact hero:", err));
  }, []);

  return (
    <main className="relative flex h-[38vh] sm:h-[45vh] md:h-[60vh]">
      <Image
        src={hero.image_url || "/img/ContactHeroBG.jpg"}
        alt="ZenTree Contact Hero"
        fill
        priority
        loading="eager"
        className="object-cover brightness-50 z-0"
      />
      <div className="container top-10 z-10 text-white">
        <div className="hero">
          <h1 className="Hero-H1 text-center">{hero.title || "Contact Us"}</h1>
          <p className="text2 text-center">
            {hero.description ||
              "We are a bonsai company that values honesty and integrity. Introducing quality bonsais and care."}
          </p>
        </div>
      </div>
    </main>
  );
}
