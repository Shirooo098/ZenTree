"use client";
import { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface FAQ {
  id?: number;
  title: string;
  description: string;
}

export default function CareFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetch("/api/care-faq")
      .then(res => res.json())
      .then(data => {
        // Ensure it's always an array
        setFaqs(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Failed to fetch FAQs:", err);
        setFaqs([]); // fallback
      });
  }, []);

  return (
    <main className="flex items-center justify-center text-center flex-col gap-[0vw]">
      <p className="mb-[2vw] text-4xl font-bold italic">Frequently Asked Questions</p>
      <div className="w-[80vw] mb-0">
        {Array.isArray(faqs) && faqs.length > 0 ? (
          faqs.map(faq => (
            <Accordion
              key={faq.id}
              disableGutters
              className="border-1 rounded-sm border-[#d9d9d9] text-start"
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls={`panel-${faq.id}-content`}
                id={`panel-${faq.id}-header`}
              >
                <Typography component="span" className="py-3">
                  <span className="faqs-span">{faq.title}</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="mb-0">
                <Typography>{faq.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p className="text-gray-500">No FAQs available.</p>
        )}
      </div>
    </main>
  );
}
