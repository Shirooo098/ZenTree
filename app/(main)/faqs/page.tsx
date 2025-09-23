import * as React from 'react';
import FaqsHero from "@/app/ui/Faqs/faqs-hero";
import FaqsBody from "@/app/ui/Faqs/faqs-body";
import FaqsFrequestions from "@/app/ui/Faqs/faqs-frequestions";
import PersonalInfromation from "@/app/ui/Faqs/perosnal-information";


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

      <div>
        <PersonalInfromation />
      </div>
    </>
   );
}
