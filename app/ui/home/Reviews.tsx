import { DMSans } from "../fonts";
import RecentReviews from "./ReviewsCard";

export default function Reviews(){

    return(
        <>
            <section className="w-full bg-[#F6F6F6] flex flex-col justify-center px-8 md:px-20 py-24">
                <h2 className={`${DMSans.className} capitalize font-bold text-3xl  md:text-4xl  text-dark-brown`}>Recent Reviews</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
                    <RecentReviews/>
                </div>
            </section>
        </>
    )
}