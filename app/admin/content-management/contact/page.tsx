"use client";
import { useEffect, useState } from "react";

export default function ContactAdminPage() {
  // Hero section
  const [hero, setHero] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  // Contact detail section
  const [detail, setDetail] = useState({
    location: "",
    phone: "",
    email: "",
  });

  // Fetch data on mount
  useEffect(() => {
    // Fetch hero
    fetch("/api/contact-hero")
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Failed to fetch contact hero:", err));

    // Fetch contact detail
    fetch("/api/contact-detail")
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .catch((err) => console.error("Failed to fetch contact details:", err));
  }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetail({ ...detail, [e.target.name]: e.target.value });
  };

  const handleHeroSave = async () => {
    await fetch("/api/contact-hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    alert("✅ Contact hero updated!");
  };

  const handleDetailSave = async () => {
    await fetch("/api/contact-detail", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detail),
    });
    alert("✅ Contact details updated!");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center space-y-16">
      {/* Hero Section Editor */}
      <section className="w-full max-w-8xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">Edit Contact Section</h1>

        <div className="space-y-6">
          <InputField label="Title" name="title" value={hero.title} onChange={handleHeroChange} />
          <TextArea label="Description" name="description" value={hero.description} onChange={handleHeroChange} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleHeroSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition text-center"
          >
            Save Hero
          </button>
        </div>
      </section>

      {/* Contact Detail Editor */}
      <section className="w-full max-w-8xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">Edit Contact Details</h1>

        <div className="space-y-6">
          <InputField label="Location" name="location" value={detail.location} onChange={handleDetailChange} />
          <InputField label="Phone Number" name="phone" value={detail.phone} onChange={handleDetailChange} />
          <InputField label="Email" name="email" value={detail.email} onChange={handleDetailChange} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDetailSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition text-center"
          >
            Save Contact Details
          </button>
        </div>
      </section>
    </main>
  );
}

function InputField({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-gray-600 text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        value={value ?? ""}      // <- fallback to empty string
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-gray-600 text-sm font-medium">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}   // <- fallback to empty string
        onChange={onChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}

