import Image from "next/image";
import { FaTree, FaBookOpen } from "react-icons/fa";


async function getAboutPageContent() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/aboutpage-content`, {
    cache: 'no-store' // or 'force-cache' depending on your needs
  });
 
  if (!res.ok) {
    throw new Error('Failed to fetch about page content');
  }
 
  return res.json();
}


export default async function AboutUsHero() {
  const content = await getAboutPageContent();


  return (
    <>
      {/* Hero Section */}
      <main className="relative flex h-[80vh]">
        <Image
          src="/img/AboutUsHero.jpg"
          alt="ZenTree Hero"
          fill
          priority
          loading="eager"
          className="object-cover brightness-50 z-0"
        />


        <div className="flex w-[35%] ml-[10%] z-10 text-white relative">
          <div className="flex-1 mt-[30vh]">
            <h1 className="Hero-H1">{content?.hero_title}</h1>
            <p className="text2 text-justify">{content?.hero_desc}</p>
          </div>
        </div>
      </main>


      {/* What We Are */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 my-40">
        <div className="flex justify-center">
          <Image
            src="/img/Whatweare.jpg"
            alt="What we are"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>


        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold">{content?.what_title}</h2>
          <p className="text-justify leading-relaxed text-lg">{content?.what_desc}</p>
        </div>
      </section>


      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 pb-25">
        <div className="flex flex-col space-y-6 pr-20 border-r-2 border-black ">
          <Image
            src="/img/bonsai-vision.jpg"
            alt="Bonsai Vision"
            width={400}
            height={300}
            className="rounded-lg shadow-md mx-auto"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">{content?.vision_title}</h2>
            <p className="text-justify leading-relaxed text-lg">{content?.vision_desc}</p>
          </div>
        </div>


        <div className="flex flex-col space-y-6 pl-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">{content?.mission_title}</h2>
            <p className="text-justify leading-relaxed text-lg">{content?.mission_desc}</p>
          </div>
          <Image
            src="/img/bonsai-mission.jpg"
            alt="Bonsai Mission"
            width={400}
            height={300}
            className="rounded-lg shadow-md mx-auto"
          />
        </div>
      </section>
    </>
  );
}
