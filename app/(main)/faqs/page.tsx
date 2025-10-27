import * as React from 'react';
import FaqsHero from "@/app/ui/Faqs/faqs-hero";
import FaqsBody from "@/app/ui/Faqs/faqs-body";
import FaqsFrequestions from "@/app/ui/Faqs/faqs-frequestions";
import { Metadata } from 'next';
// import PersonalInfromation from "@/app/ui/Faqs/perosnal-information";

export const metadata: Metadata = {
  title: 'FAQs',
};


export default function FAQs() {
   return (
    <>
      <div>
         <FaqsHero />
      </div>

      <div>
        <FaqsBody />
      </div>

      <div>
        <FaqsFrequestions />
      </div>

      {/* <div>
        <PersonalInfromation />
      </div> */}
    </>
   );
}
