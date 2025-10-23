"use client";
import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface FAQ {
  id: number;
  category: string;
  title: string;
  description: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetch("/api/faqs").then(res => res.json()).then(setFaqs).catch(console.error);
  }, []);

  const safeFaqs = Array.isArray(faqs) ? faqs : [];

  const grouped = safeFaqs.reduce((acc: any, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {});

  return (
    <main className="px-8 pt-16 max-w-7xl mx-auto">
      
      {Object.keys(grouped).map((category) => (
        <div key={category} className="mb-10">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 border-b border-black pb-3">
            {category}
          </h1>
          <div className="space-y-3">
            {grouped[category].map((faq: FAQ) => (
              <Accordion
                key={faq.id}
                className="border rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography className="text-2xl font-semibold text-black">
                    {faq.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="text-xl text-gray-600 leading-relaxed">
                    {faq.description}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
