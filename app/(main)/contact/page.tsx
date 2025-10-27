import HeroSection from "../../ui/contact/HeroSection";
import ContactForm from "../../components/forms/contact-form";
import DetailSection from "../../ui/contact/DetailSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us',
};


export default function Contact(){
    return(
        <><HeroSection />
        <ContactForm />
        <DetailSection />
        </>
    );
}