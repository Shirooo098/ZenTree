import Image from "next/image"

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
                <h1 className="text-main-white z-1">ZenTree</h1>
            </main>
        </>
    )
}