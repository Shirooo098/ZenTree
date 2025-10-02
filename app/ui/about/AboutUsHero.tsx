import Image from "next/image";
import { FaTree, FaTools, FaBookOpen } from "react-icons/fa";

export default function AboutUsHero() {
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
            <h1 className="Hero-H1">About Us</h1>
            <p className="text2 text-justify">
              At ZenTree, we make bonsai simple and inspiring for beginners and
              enthusiasts. Our mission is to provide quality products, easy
              guides, and a welcoming community that helps you grow your passion
              and connect with nature.
            </p>
          </div>
        </div>
      </main>

      {/* What We Are Section (unchanged) */}
      {/* What We Are Section (compressed to match Mission & Vision) */}
<section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 my-40">
  {/* Image */}
  <div className="flex justify-center">
    <Image
      src="/img/Whatweare.jpg"
      alt="What we are"
      width={400}
      height={300}
      className="rounded-lg shadow-md"
    />
  </div>

  {/* Text */}
  <div className="flex flex-col justify-center space-y-6">
    <h2 className="text-2xl font-bold">What we are</h2>
    <p className="text-justify leading-relaxed text-lg">
      Everyone can be a bonsai artist, from someone who is just starting
      to someone who already does it for a hobby. ZenTree offers a wide
      variety of products, ranging from Japanese style plants to Chinese
      style plants. ZenTree promotes a healthy therapeutic lifestyle for
      those people who want to have a peaceful and relaxing hobby at home.
    </p>
  </div>
</section>


      {/* Mission & Vision Section */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Vision (image top, text bottom) */}
        <div className="flex flex-col space-y-6 pr-20 border-r-2 border-black ">
          <Image
            src="/img/bonsai-vision.jpg"
            alt="Bonsai Vision"
            width={400}
            height={300}
            className="rounded-lg shadow-md mx-auto"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-justify leading-relaxed text-lg">
              ZenTree envisions becoming a trusted global community where
              beginners and bonsai enthusiasts alike find inspiration, guidance,
              and high-quality products. We strive to cultivate a passion for
              bonsai as both an art and a lifestyle, fostering growth,
              creativity, and well-being for our customers while creating
              meaningful connections through nature.
            </p>
          </div>
        </div>

        {/* Mission (text top, image bottom) */}
        <div className="flex flex-col space-y-6 pl-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-justify leading-relaxed text-lg">
              At ZenTree, our mission is to promote and produce bonsai products
              for our enthusiasts and beginner target audiences. Over the next
              12 months, our goal is for 10–20% of customers to take a chance to
              try our product. By gaining positive feedback, we’ll stay
              motivated to improve our website, reduce dealer complaints, and
              deliver consistent value. These efforts will unite people around
              new hobbies that encourage growth and well-being for both
              individuals and communities.
            </p>
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

      <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-12 underline decoration-2 underline-offset-4">
          Our Products
        </h2>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4 hover:shadow-lg transition">
            <FaTree className="text-4xl text-army-brown mx-auto" />
            <h3 className="font-bold text-lg">Bonsai</h3>
            <p className="text-sm text-gray-600">
              Miniature, potted trees that are carefully styled to resemble
              full-sized, mature trees in nature, rather than being genetically
              dwarfed plants.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-2 bg-army-brown text-white rounded-full hover:bg-hover-army-brown  transition"
            >
              →
            </a>
          </div>

          {/* Product 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4 hover:shadow-lg transition">
            <FaTools className="text-4xl text-army-brown mx-auto" />
            <h3 className="font-bold text-lg">Tools</h3>
            <p className="text-sm text-gray-600">
              Tools to properly care for and maintain bonsai trees.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-2 bg-army-brown text-white rounded-full hover:bg-hover-army-brown transition"
            >
              →
            </a>
          </div>

          {/* Product 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4 hover:shadow-lg transition">
            <FaBookOpen className="text-4xl text-army-brown mx-auto" />
            <h3 className="font-bold text-lg">Care Guide</h3>
            <p className="text-sm text-gray-600">
              Learn the proper techniques for different bonsai species and
              seasons.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-2 bg-army-brown text-white rounded-full hover:bg-hover-army-brown transition"
            >
              →
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
