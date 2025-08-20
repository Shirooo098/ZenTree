import { DMSans, ManRope } from "../fonts";
import { SlSocialInstagram, SlSocialFacebook  } from "react-icons/sl";
import { TiSocialTwitter } from "react-icons/ti";


export default function Footer() {
  return (
    <>
        <section className="flex flex-col justify-between bg-dark-brown size-full text-calm-green p-12">
            <div className="flex flex-col-reverse md:flex-row justify-between">
                <div className="flex flex-col md:w-1/4 mt-10 md:mt-0 lg:w-1/3">
                    <h2 className={`${DMSans.className} footer-heading`}>Join our newsletter for exclusive deals!</h2>
                    <input type="text"
                        placeholder="Subscribe"
                        className="bg-calm-green text-dark-brown outline-none 
                        rounded-xl px-2 py-4 mt-5 "
                    />
                    <p className="mt-2 text-xs lg:text-sm">We’ll notify you whenever special deals are available. Don’t miss exclusive discounts on your favorite bonsai and kits.</p>
                </div>
                <div className="flex justify-between md:justify-around  w-full">
                    <div>
                        <h4 className={`${DMSans.className} footer-heading`}>Shop</h4>
                        <div className={`${ManRope.className} footer-nav`}>
                            <p>Bonzai</p>
                            <p>Package</p>
                            <p>Kit</p>
                        </div>
                    </div>
                    <div>
                        <h4 className={`${DMSans.className} footer-heading`}>ZenTree</h4>
                        <div className={`${ManRope.className} footer-nav`}>
                            <p>About Us</p>
                            <p>Products</p>
                            <p>Contact</p>
                        </div>
                    </div>
                    <div>
                        <h4 className={`${DMSans.className} footer-heading`}>Customer Care</h4>
                        <div className={`${ManRope.className} footer-nav`}>
                            <p>Bonzai</p>
                            <p>Track Order</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-20">
                <div className="capitalize flex flex-col sm:flex-row w-2/3 justify-between">
                    <h4 className="text-xs sm:text-base md:text-lg lg:text-xl font-medium">©2025 all rights reserved</h4>
                    <h4 className="text-xs sm:text-base md:text-lg lg:text-xl font-medium">Privacy Package</h4>
                    <h4 className="text-xs sm:text-base md:text-lg lg:text-xl font-medium">Term & Conditions</h4>
                </div>
                <div className="flex w-50 justify-around">
                    <SlSocialFacebook size={30}/>
                    <SlSocialInstagram size={30}/>
                    <TiSocialTwitter size={30}/>
                </div>
            </div>
        </section>
    </>
  )
}
