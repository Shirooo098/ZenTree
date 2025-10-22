import Image from "next/image";
import { DMSans, ManRope } from "../fonts";

async function getBonsaiContent() {
  const res = await fetch(`${process.env.BASE_URL}/api/bonsai-content`, { cache: "no-store" });
  return res.json();
}

export default async function BonsaiSection() {
  const content = await getBonsaiContent();

  return (
    <main className="min-h-screen my-20 px-4 sm:px-8 md:px-12 lg:px-16 mx-auto max-w-screen text-justify">
      <section className="flex flex-col gap-16">
        {/* Bonsai 1 */}
        <article className="flex flex-col lg:flex-row justify-center items-center gap-8 mt-10">
          <div className="flex justify-center items-center w-2/3 lg:w-1/3">
           <Image
  src="/img/GinsengBonsai.jpg"
  alt="Ginseng Ficus Bonsai"
  height={700}
  width={700}
  className="object-cover"
/>
          </div>
          <div className="w-full lg:w-1/2 p-2 sm:p-4">
            <h3 className={`${DMSans.className} font-extrabold text-center lg:text-start text-3xl`}>
              {content.bonsai1_title}
            </h3>
            <p className={`${ManRope.className} mt-6 text-lg tracking-wide`}>
              {content.bonsai1_description}
            </p>
          </div>
        </article>

        {/* Bonsai 2 */}
        <article className="flex flex-col lg:flex-row-reverse justify-center items-center mt-20 gap-8">
          <div className="flex justify-center items-center w-2/3 lg:w-1/3">
            <Image src="/img/OakBonsai.jpg"  alt="Ginseng Ficus Bonsai"
  height={700}
  width={700}
  className="object-cover" />
          </div>
          <div className="w-full lg:w-1/2 p-2 sm:p-4">
            <h3 className={`${DMSans.className} font-extrabold text-center lg:text-start text-3xl`}>
              {content.bonsai2_title}
            </h3>
            <p className={`${ManRope.className} mt-6 text-lg tracking-wide`}>
              {content.bonsai2_description}
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
