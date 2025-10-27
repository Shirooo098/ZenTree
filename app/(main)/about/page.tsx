import AboutUsHero from "@/app/ui/about/AboutUsHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us',
};


export default function About(){
    return(
        <div className="">
            <AboutUsHero />
        </div>
    )
}