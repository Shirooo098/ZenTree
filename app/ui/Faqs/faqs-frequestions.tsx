import Link from "next/link";

export default function faqsfrequestions() {
  return (
    <div className="mt-20">
      <div className="flex flex-col text-center items-center ">
        <div>
          <h1 className="text-2xl pb-3 ">Still Have Questions</h1>
        </div>

        <div>
          <p className="text-sm pb-5 text-gray-500">
            Our bonsai experts are here to help you with personalized advice and
            solutions.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center pb-10">
        <div className="flex flex-row space-x-12">
          <Link href="/contact">
            <button className="px-4 py-2 rounded-[10px] bg-army-brown text-white px-5 text-sm">
              Contact Support
            </button>
          </Link>


         <Link href="/product">
          <button className="px-4 py-2 rounded-[10px] border border-gray-300 text-sm">
            Browse Bonsai Collection
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
