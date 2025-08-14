import Image from "next/image"
import { DMSans } from "../fonts"
import Button from "../button"

export default function CheckNow(){
    return(
        <section className="relative flex justify-center items-center h-[60vh] mt-20">
            <Image
                src={'/img/login-bg.jpeg'}
                alt="Check Our Bonzai"
                fill
                className="object-cover brightness-65"
            />
            <div className="flex-col justify-center text-center  z-1">
                <h1 className={`${DMSans.className} capitalize font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-calm-green z-1`}>Check Our Bonzai</h1>
                <Button variant="secondary" size="lg" className={`${DMSans.className} capitalize text-calm-green px-4 py-2 sm:w-[140px] md:w-[160px] lg:w-[200px] mt-5`} >Check Now</Button>
            </div>
        </section>
    )
}