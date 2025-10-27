"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FaqsHero() {
  const [faq, setFaq] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetch("/api/faq-hero")
      .then((res) => res.json())
      .then((data) => setFaq(data))
      .catch((err) => console.error("Failed to fetch FAQ hero:", err));
  }, []);

  return (
    <>
      <div className="relative w-full py-80  font-sans max-h-100 overflow-hidden ">
        
        <div className="img-banner absolute inset-0 -z-10">
          <Image
            className="object-cover w-full h-full"
            src={faq.image_url || "/img/question-background.jpg"}
            alt="FAQ Background"
            fill
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto text-white text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            {faq.title || ""}
          </h1>
          <p className="text-lg">
            {faq.description ||
              ""}
          </p>
        </div>

        
      </div>
    </>
  );
}
