"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button } from "@/components/ui/button";

interface FAQ {
  id?: number;
  category: string;
  title: string;
  description: string;
}

interface Hero {
  title: string;
  description: string;
  image_url?: string;
}

export default function AdminFaqsPage() {
  const [faqHero, setFaqHero] = useState<Hero>({
    title: "",
    description: "",
    image_url: "",
  });

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [form, setForm] = useState<FAQ>({
    category: "",
    title: "",
    description: "",
  });
  const [editing, setEditing] = useState<FAQ | null>(null);

  useEffect(() => {
    fetchFaqHero();
    fetchFaqs();
  }, []);

  const fetchFaqHero = async () => {
    try {
      const res = await fetch("/api/faq-hero");
      const data = await res.json();
      setFaqHero(data || { title: "", description: "", image_url: "" });
    } catch (err) {
      console.error("Failed to fetch FAQ hero:", err);
    }
  };

  const fetchFaqs = async () => {
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setFaqs(Array.isArray(data) ? data : []);
  };

  const saveFaqHero = async () => {
    const toastId = toast.loading("Saving FAQ Hero...");
    try {
      await fetch("/api/faq-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqHero),
      });
      toast.success("FAQ Hero updated!", { id: toastId });
    } catch {
      toast.error("Failed to update FAQ Hero", { id: toastId });
    }
  };

  const handleHeroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFaqHero({ ...faqHero, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const toastId = toast.loading(
      editing ? "Updating FAQ..." : "Adding FAQ..."
    );
    try {
      await fetch("/api/faqs", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? form : { ...form }),
      });

      toast.success(editing ? "FAQ updated!" : "FAQ added!", { id: toastId });
      setForm({ category: "", title: "", description: "" });
      setEditing(null);
      fetchFaqs();
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error saving FAQ", { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await fetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Deleted successfully", { id: toastId });
      fetchFaqs();
    } catch {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm(faq);
  };

  const grouped = faqs.reduce((acc: any, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-16">
      {/* 🌿 HERO SECTION */}
      <section className="border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          FAQ Hero Section
        </h1>
        <div className="space-y-4">
          <InputField
            label="Hero Title"
            name="title"
            value={faqHero.title}
            onChange={handleHeroChange}
          />
          <TextArea
            label="Hero Description"
            name="description"
            value={faqHero.description}
            onChange={handleHeroChange}
          />
        </div>
        <div className="flex justify-center mt-5">
          <Button
            onClick={saveFaqHero}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Hero
          </Button>
        </div>
      </section>

      {/* 📚 FAQ MANAGEMENT */}
      <section>
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          FAQ Management
        </h1>

        {/* FORM */}
        <div className="border rounded-lg p-6 bg-gray-50 shadow-sm mb-10">
          <h2 className="font-semibold mb-4 text-lg text-gray-700">
            {editing ? "Edit FAQ" : "Add New FAQ"}
          </h2>
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border w-full p-2 rounded"
            />
            <input
              type="text"
              placeholder="Question / Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border w-full p-2 rounded"
            />
            <textarea
              placeholder="Answer / Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border w-full p-2 rounded h-24 resize-none"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSubmit} className="bg-green-600 text-white">
              {editing ? "Update FAQ" : "Add FAQ"}
            </Button>
            {editing && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setForm({ category: "", title: "", description: "" });
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* CATEGORY-GROUPED FAQ DISPLAY */}
        <div className="space-y-10">
          {Object.keys(grouped).map((category) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-green-700">{category}</h2>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600"
                  onClick={() =>
                    setForm({ category, title: "", description: "" })
                  }
                >
                  + Add to {category}
                </Button>
              </div>

              <div className="space-y-3">
                {grouped[category].map((faq: FAQ) => (
                  <Accordion
                    key={faq.id}
                    className="border rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                      <Typography className="font-medium text-gray-800">
                        {faq.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography className="text-gray-600 mb-3">
                        {faq.description}
                      </Typography>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(faq)}
                          className="text-blue-600 border-blue-600"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(faq.id!)}
                          className="text-white"
                        >
                          Delete
                        </Button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ✅ Reusable Input Field */
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

/* ✅ Reusable TextArea */
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
