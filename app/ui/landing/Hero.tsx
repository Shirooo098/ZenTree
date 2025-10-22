
import Image from "next/image";
import { DMSans } from "../fonts";


async function getHeroContent() {
  const res = await fetch(`${process.env.BASE_URL}/api/homepage-content`, {
    cache: "no-store",
  });
  return res.json();
}


export default async function Hero() {
  const content = await getHeroContent();


  return (
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
  );
}
