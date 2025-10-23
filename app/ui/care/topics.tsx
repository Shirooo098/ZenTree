"use client";
import { useEffect, useState } from "react";
import CareSearch from "@/app/components/search/SearchBar";

interface Topic { id: number; title: string; description: string; }
interface Hero { title: string; description: string; }

export default function CareTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [hero, setHero] = useState<Hero>({ title: "", description: "" });

  useEffect(() => {
    fetch("/api/care-hero").then(res => res.json()).then(setHero).catch(console.error);
    fetch("/api/care-topics").then(res => res.json()).then(setTopics).catch(console.error);
  }, []);

  return (
    <div className="flex p-10 flex-col justify-center items-center text-center">
      <CareSearch />

      <div className="text-base pt-10">
        <h2 className="text-3xl font-bold">{hero.title}</h2>
        <p className="pt-2">{hero.description}</p>
       
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10 pt-10 xs:grid-cols-1 m-10">
        {topics.map(topic => (
          <div key={topic.id} className="border rounded-[10px] bg-white w-100 h-60 flex flex-col text-[15px] p-10">
            <div className="flex text-center justify-center flex-col">
              <p className="text-2xl pt-3">{topic.title}</p>
              <br />
              <p className="pt-3">{topic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
