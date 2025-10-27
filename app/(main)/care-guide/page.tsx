
// import { DMSans } from "../fonts"
import CareHero from "@/app/ui/care/Care-Hero"; 
import CareTopics from "@/app/ui/care/topics";
import Carefundamentals from "@/app/ui/care/fundamentals";
import CareFAQ from  "@/app/ui/care/CareFAQ"
import Faqsfrequestions from "@/app/ui/care/faqsQ";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Care Guide',
};


export default function CareGuide() {
  return (
    <div className="bg-[#faf8f8]">
      <CareHero />
      <CareTopics />
      <Carefundamentals />
      <CareFAQ />
      <Faqsfrequestions />

    </div>
  );
}