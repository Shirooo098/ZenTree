"use client";
import { useEffect, useState } from "react";

export default function CareHeroAdmin() {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetch("/api/care-hero")
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch((err) => console.error("Failed to fetch Care Hero:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await fetch("/api/care-hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    alert("✅ Care Hero updated!");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center">
      <section className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Edit Care Guide Section
        </h1>

        <div className="space-y-6">
          <InputField label="Title" name="title" value={hero.title} onChange={handleChange} />
          <TextArea label="Description" name="description" value={hero.description} onChange={handleChange} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all"
          >
            Save Changes
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
        value={value}
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
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
