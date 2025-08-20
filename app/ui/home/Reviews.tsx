import { DMSans } from "../fonts";
import RecentReviews from "./ReviewsCard";

export default function Reviews(){

    return(
        <>
            <section className="w-full bg-[#F6F6F6] flex flex-col justify-center px-12 py-24 lg:px-18 lg:py-36">
                <h2 className={`${DMSans.className} capitalize font-bold text-4xl text-dark-brown`}>Recent Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-16 ">
                    <RecentReviews/>
                </div>
            </section>
        </>
    )
}