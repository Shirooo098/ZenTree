"use client";

import { useEffect, useState } from "react";

export default function Page() {
  // FAQ Hero section
  const [faq, setFaq] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  // Fetch FAQ hero content
  useEffect(() => {
    fetch("/api/faq-hero")
      .then((res) => res.json())
      .then((data) => setFaq(data))
      .catch((err) => console.error("Failed to fetch FAQ hero:", err));
  }, []);

  // Handle field change
  const handleFaqChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFaq({ ...faq, [e.target.name]: e.target.value });
  };

  // Save changes
  const saveFaq = async () => {
    await fetch("/api/faq-hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faq),
    });
    alert("✅ FAQ Hero updated!");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center space-y-16">
      {/* FAQ HERO SECTION */}
      <section className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Edit FAQ Hero Section
        </h1>

        <div className="space-y-6">
          <InputField
            label="Title"
            name="title"
            value={faq.title}
            onChange={handleFaqChange}
          />
          <TextArea
            label="Description"
            name="description"
            value={faq.description}
            onChange={handleFaqChange}
          />
        
          
        </div>

        <div className="flex justify-center">
          <button
            onClick={saveFaq}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </section>
    </main>
  );
}

/* Reusable Input Field Component */
function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-gray-600 text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

/* Reusable TextArea Component */
function TextArea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: any;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-gray-600 text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
