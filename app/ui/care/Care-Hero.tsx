import Image from "next/image";

export default function CareHero() {
  return (
    
    <div className="relative flex h-[38vh] sm:h-[45vh] md:h-[60vh] justify-center items-center opacity-80">
        <Image
          src="/img/care.jpg"
          alt="ZenTree Hero"
          fill
          priority
          loading="eager"
          className="object-cover oppacity-20 z-0"
        />

     <div className="italic w-full z-10">
        <div className="flex items-center justify-start min-h-[60vh] bg-opacity-70 px-20">
          <div className="max-w-3xl text-left">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white">
              Bonsai Care Guide
            </h1>

            <p className="mt-1 text-base sm:text-lg md:text-xl lg:text-1xl leading-relaxed text-white/90">
              Master the ancient art of bonsai cultivation with our comprehensive care guide. 
              From watering techniques to seasonal adjustments, learn everything you need 
              to help your bonsai thrive for generations.
            </p>
          </div>
        </div>

      </div>
</div>
  );
}