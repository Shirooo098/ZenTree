"use client";

import { useEffect, useState } from "react";
import { MapPin, PhoneCall, Mail } from "lucide-react";

export default function DetailSection() {
  const [detail, setDetail] = useState({
    location: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/contact-detail")
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .catch((err) => console.error("Failed to fetch contact details:", err));
  }, []);

  const items = [
    {
      icon: MapPin,
      title: "Location",
      text: (
  <>
    {(detail.location || "").split(",").map((line, i) => (
      <span key={i}>
        {line.trim()}
        <br />
      </span>
    ))}
  </>
),

    },
    {
      icon: PhoneCall,
      title: "Contact Number",
      text: detail.phone,
    },
    {
      icon: Mail,
      title: "Email",
      text: detail.email,
    },
  ];

  return (
    <main className="relative flex h-[38vh] sm:h-[45vh] md:h-[80vh] bg-[#FAF8F8]">
      <div className="max-w-6xl w-full mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <h1 className="font-semibold tracking-wide text-2xl sm:text-3xl mb-2">
          We&apos;re here for you.
        </h1>
        <p className="text-gray-700 mb-8">
          Have questions or need assistance with your Zen Tree products? We&apos;re just a message away.
        </p>

        <div className="flex flex-col gap-10 items-start mt-15">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 bg-white shadow-sm rounded-md p-6 w-full max-w-md"
            >
              <div className="w-13 h-13 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border-4 border-[#675d50]">
                <Icon color="#675d50" size={20} className="sm:size-13" />
              </div>
              <div className="text-left">
                <p className="font-medium text-lg sm:text-xl">{title}</p>
                <p className="font-light text-base sm:text-lg mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
