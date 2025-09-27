
import Image from "next/image"

export default function HeroSection() {
    return (
        <>
            <main className="relative flex h-[38vh] sm:h-[45vh] md:h-[60vh]">
                <Image 
                    src={"/img/ContactHeroBG.jpg"}
                    alt="ZenTree Hero"
                    fill
                    priority
                    loading="eager"
                    className="object-cover brightness-50 z-0 "
                />
                <div className="container top-10 z-10 text-white">
                    <div className="hero">
                        <h1 className="Hero-H1 text-center">Contact Us</h1>
                        <p className="text2 text-center">
                            We are a bonsai company that values honesty and integrity.
              Introducing quality bonsais and care.

                        </p>
                    </div>

                </div>
            </main>
        </>
    );
}
