import Image from 'next/image'
import { DMSans, ManRope } from '../fonts'

export default function BonsaiSection(){
    return(
        <>
            <main className="min-h-screen mt-20 px-4 sm:px-8 md:px-12 lg:px-16 mx-auto max-w-screen">
                <section className="flex flex-col gap-8 md:gap-12 lg:gap-16">
                    <article className='flex flex-col lg:flex-row justify-center items-center gap-2 mt-10 md:gap-4 lg:gap-8'>
                        <div className="flex justify-center items-center w-2/3 lg:1/3">
                            <Image
                            src={'/img/GinsengBonsai.jpg'}
                            alt='Ginseng Ficus (Ficus Microcarpa)'
                            height={700}
                            width={700}
                            className='size-[280px] sm:size-[350px] md:size-[450px] lg:size-[700px] object-cover'
                        />
                        </div>
                        <div className="w-full lg:w-1/2 p-2 sm:p-4">
                            <h3 className={`${DMSans.className} capitalize font-extrabold text-center lg:text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl`}>Ginseng Ficus (Ficus Microcarpa)</h3>
                            <p className={`${ManRope.className} pl-0 lg:pl-6 mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl tracking-wide `}>The Ginseng Ficus (Ficus microcarpa) is a popular bonsai variety admired for its thick, gnarled trunk that resembles ginseng roots,
                                giving it a unique and sculptural appearance. Its glossy, oval-shaped leaves provide a lush, 
                                vibrant canopy that contrasts beautifully with the sturdy base. Known for being low-maintenance and resilient,
                                 it thrives indoors with bright, indirect light, making it an excellent choice for beginners and seasoned bonsai enthusiasts alike.</p>
                        </div>
                    </article>
                    <article className='flex flex-col lg:flex-row-reverse justify-center items-center mt-20 gap-2 md:gap-4 lg:gap-8'>
                        <div className="flex justify-center items-center w-2/3 lg:1/3">
                            <Image
                            src={'/img/OakBonsai.jpg'}
                            alt='Ginseng Ficus (Ficus Microcarpa)'
                            height={700}
                            width={700}
                            className='size-[280px] sm:size-[350px] md:size-[450px] lg:size-[700px] object-cover'
                        />
                        </div>
                        <div className="w-full lg:w-1/2 p-2 sm:p-4">
                            <h3 className={`${DMSans.className} capitalize font-extrabold text-center lg:text-start text-xl sm:text-2xl md:text-3xl lg:text-4xl`}>Ginseng Ficus (Ficus Microcarpa)</h3>
                            <p className={`${ManRope.className} pl-0 lg:pl-6 mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg lg:text-xl tracking-wide `}>The Ginseng Ficus (Ficus microcarpa) is a popular bonsai variety admired for its thick, gnarled trunk that resembles ginseng roots,
                                giving it a unique and sculptural appearance. Its glossy, oval-shaped leaves provide a lush, 
                                vibrant canopy that contrasts beautifully with the sturdy base. Known for being low-maintenance and resilient,
                                 it thrives indoors with bright, indirect light, making it an excellent choice for beginners and seasoned bonsai enthusiasts alike.</p>
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}