
import Image from "next/image";
import { DMSans } from "../fonts";


async function getHeroContent() {
  const res = await fetch(`/api/homepage-content`, {
    cache: "no-store",
  });
  return res.json();
}

async function getBanner() {
  const res = await fetch(`/api/promotion-banner`, { cache: "no-store" });
  return res.json();
}

export default async function Hero() {
  const content = await getHeroContent();
 const banner = await getBanner();

  return (
    <div className="overflow-visible"> 
      
{banner?.show_banner && (
  <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-700 text-white font-semibold tracking-wide py-2 z-50 shadow-md overflow-hidden whitespace-nowrap">
    <div className="marquee inline-block">
      <span className="mx-4 text-yellow-300">{banner?.title}</span>
      {banner?.subtitle} —{" "}
      <span className="text-yellow-200">{banner?.discount_text}</span> 🌿
      <span className="ml-6 italic text-sm sm:text-base">
        Bring home nature’s beauty today.
      </span>
    </div>
  </div>
)}



      <main className="relative flex h-screen justify-center items-center">
      
        <Image
          src={"/img/hero.jpg"}
          alt="ZenTree Hero"
          fill
          priority
          loading="eager"
          className="object-cover brightness-65 z-0"
        />
      
        <div className={`${DMSans.className} italic w-full z-1`}>
          
          <div className="flex flex-col items-center text-main-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl space-y-10">
            <h1 className="capitalize">{content?.quote1}</h1>
            <h1 className="capitalize">{content?.quote2}</h1>
            <h1 className="capitalize">{content?.quote3}</h1>
            <h1 className="capitalize"> {content?.author}  </h1>
          </div>

          
        </div>
      </main>

      
    </div>
  );
}
