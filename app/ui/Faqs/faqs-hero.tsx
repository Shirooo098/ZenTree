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

        <div className="flex justify-center items-center pt-8 relative z-10">
          <div
            className="flex items-center border w-80 focus-within:border-indigo-500 transition duration-300
                        pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm"
            />
            <svg
              xmlns="http:  
              width="22"
              height="22"
              viewBox="0 0 30 30"
              fill="#6B7280"
            >
              <path d="M 13 3 C 7.489 3 3 7.489 3 13s4.489 10 10 10 10-4.489 10-10S18.511 3 13 3zm0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8zm6.322 15.736L25.293 26.707a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.934 9.934 0 0 0 23 13c0-5.511-4.489-10-10-10S3 7.489 3 13s4.489 10 10 10c2.396 0 4.597-.851 6.322-2.264z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
