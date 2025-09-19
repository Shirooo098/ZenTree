import Image from "next/image"

export default function AboutUsHero() {
    return (
        <>
            <main className="relative flex h-screen">
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
                        <h1 className="Hero-H1">About Us</h1>
                        <p className="text2 text-justify">
                            At ZenTree, we make bonsai simple and inspiring for beginners and enthusiasts. 
                            Our mission is to provide quality products, easy guides, and a welcoming community 
                            that helps you grow your passion and connect with nature.
                        </p>
                    </div>
                </div>
            </main>
                {/* Content */}
                <section className="flex flex-col md:flex-row items center justify center my-40 mx-10 md:mx-110 gap-20 ">
                    <div className="w-full md:w-1/3">
                        <Image 
                        src="/img/Whatweare.jpg"
                        alt="ZenTree Hero"
                        width={500}
                        height={600}
                        className="rounded-lg shadow-lg"
                        />

                    </div>
                    <div className="w-full md:w-2/3 text-black ">
                        <h2 className="text-4xl font-bold mb-4">What we are</h2>
                        <p className="text-2xl">Everyone can be a bonsai artist, from someone who is just starting to someone who already does it for a hobby. ZenTree offers a wide variety of products, ranging form Japanese style plants to Chinese style plants. ZenTree promotes a healthy therapeutic lifestyle for thos people who want to have a peaceful and relaxing hobby at home.</p>

                    </div>
                </section>
        </>
    );
}
