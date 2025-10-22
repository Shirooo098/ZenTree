"use client";

import { useEffect, useState } from "react";

export default function Page() {
  // Hero section
  const [hero, setHero] = useState({
    quote1: "",
    quote2: "",
    quote3: "",
    author: "",
  });

  // Bonsai section
  const [bonsai, setBonsai] = useState({
    bonsai1_title: "",
    bonsai1_description: "",
    bonsai2_title: "",
    bonsai2_description: "",
  });

  // Fetch hero and bonsai content
  useEffect(() => {
    fetch("/api/homepage-content")
      .then((res) => res.json())
      .then((data) => setHero(data));

    fetch("/api/bonsai-content")
      .then((res) => res.json())
      .then((data) => setBonsai(data));
  }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleBonsaiChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBonsai({ ...bonsai, [e.target.name]: e.target.value });
  };

  const saveHero = async () => {
    await fetch("/api/homepage-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    alert("✅ Hero content updated!");
  };

  const saveBonsai = async () => {
    await fetch("/api/bonsai-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bonsai),
    });
    alert("🌿 Bonsai content updated!");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center space-y-16">
      
      <section className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">Edit Home Section</h1>

        <div className="space-y-6">
          <InputField label="Quote Line 1" name="quote1" value={hero.quote1} onChange={handleHeroChange} />
          <InputField label="Quote Line 2" name="quote2" value={hero.quote2} onChange={handleHeroChange} />
          <InputField label="Quote Line 3" name="quote3" value={hero.quote3} onChange={handleHeroChange} />
          <InputField label="Author" name="author" value={hero.author} onChange={handleHeroChange} />
        </div>

        <div className="flex justify-center">
          <button onClick={saveHero} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all">
            Save Hero Changes
          </button>
        </div>
      </section>

      {/* BONSAI SECTION EDIT */}
      <section className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">Edit Bonsai Section</h1>

        <div className="space-y-6">
          <InputField label="Bonsai 1 Title" name="bonsai1_title" value={bonsai.bonsai1_title} onChange={handleBonsaiChange} />
          <TextArea label="Bonsai 1 Description" name="bonsai1_description" value={bonsai.bonsai1_description} onChange={handleBonsaiChange} />

          <InputField label="Bonsai 2 Title" name="bonsai2_title" value={bonsai.bonsai2_title} onChange={handleBonsaiChange} />
          <TextArea label="Bonsai 2 Description" name="bonsai2_description" value={bonsai.bonsai2_description} onChange={handleBonsaiChange} />
        </div>

        <div className="flex justify-center">
          <button onClick={saveBonsai} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-all">
            Save Bonsai Changes
          </button>
        </div>
      </section>
    </main>
  );
}

function InputField({ label, name, value, onChange }: any) {
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

function TextArea({ label, name, value, onChange }: any) {
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
