import Image from "next/image"
import { DMSans } from "../fonts"

export default function Hero(){
    return ( 
        <>
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
                        <h1 className="capitalize">&quot;Planted in the dirt</h1>
                        <h1 className="capitalize">Paper wing begins to sprout</h1>
                        <h1 className="capitalize">Tree full of promise.&quot;</h1>
                        <h1 className="capitalize">- ZenTree</h1>
                    </div>
                </div>
            </main>
        </>
    )
}