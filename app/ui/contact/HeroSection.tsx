import { DMSans } from "../fonts";
import Image from "next/image"

export default function HeroSection() {
    return (
        <>
            <main className="relative flex h-screen ">
                <Image 
                    src={"/img/ContactHeroBG.jpg"}
                    alt="ZenTree Hero"
                    fill
                    priority
                    loading="eager"
                    className="object-cover brightness-60 z-0 "
                />
                <div className="container top-10 z-10 text-white">
                    <div className="hero">
                        <h1 className="Hero-H1">Contact Us</h1>
                        <p className="text1">
                            We are a bonsai company that values honesty and integrity.
              Introducing quality bonsais and care.

                        </p>
                    </div>

                </div>
            </main>
        </>
    );
}
