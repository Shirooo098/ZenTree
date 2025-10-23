"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // ✅ Import toast from Sonner

interface Topic { id?: number; title: string; description: string; }
interface Hero { title: string; description: string; image_url?: string; }
interface FAQ { id?: number; title: string; description: string; }

export default function CareAdminPage() {
  // HERO
  const [hero, setHero] = useState<Hero>({ title: "", description: "", image_url: "" });

  // TOPICS
  const [topics, setTopics] = useState<Topic[]>([]);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicForm, setTopicForm] = useState({ title: "", description: "" });

  // FAQ
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ title: "", description: "" });

  useEffect(() => {
    fetch("/api/care-hero").then(res => res.json()).then(setHero).catch(console.error);
    fetchTopics();
    fetchFaqs();
  }, []);

  // 🧭 HERO HANDLERS
  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHero({ ...hero, [e.target.name]: e.target.value });
  };

  const handleHeroSave = async () => {
    const toastId = toast.loading("Saving hero section...");
    try {
      const res = await fetch("/api/care-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });
      if (res.ok) toast.success(" Care Hero updated!", { id: toastId });
      else toast.error(" Failed to update Care Hero.", { id: toastId });
    } catch {
      toast.error(" Something went wrong while saving.", { id: toastId });
    }
  };

  // 🌿 TOPIC HANDLERS
  const fetchTopics = () => {
    fetch("/api/care-topics")
      .then(res => res.json())
      .then(setTopics)
      .catch(console.error);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTopicForm({ ...topicForm, [e.target.name]: e.target.value });
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingTopic ? "Updating topic..." : "Adding new topic...");

    try {
      const url = "/api/care-topics";
      const method = editingTopic ? "PUT" : "POST";
      const body = editingTopic ? { id: editingTopic.id, ...topicForm } : topicForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingTopic ? " Topic updated!" : " Topic added!", { id: toastId });
        setTopicForm({ title: "", description: "" });
        setEditingTopic(null);
        fetchTopics();
      } else {
        toast.error(" Failed to save topic.", { id: toastId });
      }
    } catch {
      toast.error(" Error saving topic.", { id: toastId });
    }
  };

  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicForm({ title: topic.title, description: topic.description });
    toast.info(" Editing topic...");
  };

  const handleDeleteTopic = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this topic?");
    if (!confirmed) return;

    const toastId = toast.loading("Deleting topic...");
    try {
      const res = await fetch("/api/care-topics", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success(" Topic deleted successfully!", { id: toastId });
        fetchTopics();
      } else {
        toast.error(" Failed to delete topic.", { id: toastId });
      }
    } catch {
      toast.error(" Error deleting topic.", { id: toastId });
    }
  };

  // ❓ FAQ HANDLERS
  const fetchFaqs = () => {
    fetch("/api/care-faq")
      .then(res => res.json())
      .then(data => setFaqs(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const handleFaqChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFaqForm({ ...faqForm, [e.target.name]: e.target.value });
  };

  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingFaq ? "Updating FAQ..." : "Adding new FAQ...");

    try {
      const url = "/api/care-faq";
      const method = editingFaq ? "PUT" : "POST";
      const body = editingFaq ? { id: editingFaq.id, ...faqForm } : faqForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingFaq ? "💬 FAQ updated!" : "🆕 FAQ added!", { id: toastId });
        setFaqForm({ title: "", description: "" });
        setEditingFaq(null);
        fetchFaqs();
      } else {
        toast.error(" Failed to save FAQ.", { id: toastId });
      }
    } catch {
      toast.error(" Error saving FAQ.", { id: toastId });
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setFaqForm({ title: faq.title, description: faq.description });
    toast.info(" Editing FAQ...");
  };

  const handleDeleteFaq = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this FAQ?");
    if (!confirmed) return;

    const toastId = toast.loading("Deleting FAQ...");
    try {
      const res = await fetch("/api/care-faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success(" FAQ deleted successfully!", { id: toastId });
        fetchFaqs();
      } else {
        toast.error(" Failed to delete FAQ.", { id: toastId });
      }
    } catch {
      toast.error(" Error deleting FAQ.", { id: toastId });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 flex flex-col items-center space-y-12">

      {/* HERO SECTION */}
      <section className="w-full max-w-8xl bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Edit Care Guide</h1>
        <InputField label="Title" name="title" value={hero.title} onChange={handleHeroChange} />
        <TextArea label="Description" name="description" value={hero.description} onChange={handleHeroChange} />
        <div className="flex justify-center">
          <button
            onClick={handleHeroSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition text-center">
            Save Changes
          </button>
        </div>
      </section>

      {/* TOPICS SECTION */}
      <section className="w-full max-w-8xl">
        <form onSubmit={handleTopicSubmit} className="mb-10 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Manage Care Topics</h2>
          <InputField label="Title" name="title" value={topicForm.title} onChange={handleTopicChange} />
          <TextArea label="Description" name="description" value={topicForm.description} onChange={handleTopicChange} />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition">
            {editingTopic ? "Update Topic" : "Add Topic"}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {topics.map(topic => (
            <div key={topic.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div>
                <p className="font-semibold text-gray-800">{topic.title}</p>
                <p className="text-gray-600">{topic.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditTopic(topic)} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-1 rounded-lg transition">
                  Edit
                </button>
                <button onClick={() => handleDeleteTopic(topic.id!)} className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1 rounded-lg transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="w-full max-w-8xl">
        <form onSubmit={handleFaqSubmit} className="mb-10 flex flex-col gap-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Manage FAQs</h2>
          <InputField label="Question" name="title" value={faqForm.title} onChange={handleFaqChange} />
          <TextArea label="Answer" name="description" value={faqForm.description} onChange={handleFaqChange} />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition">
            {editingFaq ? "Update FAQ" : "Add FAQ"}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {faqs.map(faq => (
            <div key={faq.id} className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div>
                <p className="font-semibold text-gray-800">{faq.title}</p>
                <p className="text-gray-600">{faq.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditFaq(faq)} className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-1 rounded-lg transition">
                  Edit
                </button>
                <button onClick={() => handleDeleteFaq(faq.id!)} className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-1 rounded-lg transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ✅ Reusable Input Components
function InputField({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-600 text-sm font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 transition"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-600 text-sm font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 transition resize-none"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
}
