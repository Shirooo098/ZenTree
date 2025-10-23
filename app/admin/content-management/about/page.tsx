"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [content, setContent] = useState({
    hero_title: "",
    hero_desc: "",
    what_title: "",
    what_desc: "",
    vision_title: "",
    vision_desc: "",
    mission_title: "",
    mission_desc: "",
  });

  useEffect(() => {
    fetch("/api/aboutpage-content")
      .then((res) => res.json())
      .then((data) =>
        setContent({
          hero_title: data.hero_title ?? "",
          hero_desc: data.hero_desc ?? "",
          what_title: data.what_title ?? "",
          what_desc: data.what_desc ?? "",
          vision_title: data.vision_title ?? "",
          vision_desc: data.vision_desc ?? "",
          mission_title: data.mission_title ?? "",
          mission_desc: data.mission_desc ?? "",
        })
      )
      .catch((err) => console.error("Error loading about page content:", err));
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleSave = async () => {
    const res = await fetch("/api/aboutpage-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });


    if (res.ok) {
      alert("✅ About Page content updated!");
    } else {
      alert("❌ Failed to update content");
    }
  };


  return (
    <main className="min-h-screen bg-white px-4 py-12 flex flex-col items-center space-y-16">
      <section className="w-full max-w-8xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Edit About Us Section
        </h1>


        {/* HERO SECTION */}
        <ContentSection
          title="Hero Section"
          fields={[
            { label: "Hero Title", name: "hero_title" },
            { label: "Hero Description", name: "hero_desc", isTextArea: true },
          ]}
          content={content}
          onChange={handleChange}
        />


        {/* WHAT WE DO SECTION */}
        <ContentSection
          title="What We Do"
          fields={[
            { label: "What Title", name: "what_title" },
            { label: "What Description", name: "what_desc", isTextArea: true },
          ]}
          content={content}
          onChange={handleChange}
        />


        {/* VISION SECTION */}
        <ContentSection
          title="Vision Section"
          fields={[
            { label: "Vision Title", name: "vision_title" },
            { label: "Vision Description", name: "vision_desc", isTextArea: true },
          ]}
          content={content}
          onChange={handleChange}
        />


        {/* MISSION SECTION */}
        <ContentSection
          title="Mission Section"
          fields={[
            { label: "Mission Title", name: "mission_title" },
            { label: "Mission Description", name: "mission_desc", isTextArea: true },
          ]}
          content={content}
          onChange={handleChange}
        />


        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition text-center"
          >
            Save All Changes
          </button>
        </div>
      </section>
    </main>
  );
}


function ContentSection({ title, fields, content, onChange }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
        {title}
      </h2>
      {fields.map((field: any) =>
        field.isTextArea ? (
          <TextArea
            key={field.name}
            label={field.label}
            name={field.name}
            value={content[field.name]}
            onChange={onChange}
          />
        ) : (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            value={content[field.name]}
            onChange={onChange}
          />
        )
      )}
    </div>
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
        value={value || ""}
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
        value={value || ""}
        onChange={onChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition resize-none"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
