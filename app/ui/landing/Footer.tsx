import { DMSans, ManRope } from "../fonts";
import { SlSocialInstagram, SlSocialFacebook  } from "react-icons/sl";
import { TiSocialTwitter } from "react-icons/ti";



export default function Footer() {

  return (
    <>
        <section className="flex flex-col justify-between bg-dark-brown size-full text-calm-green py-4 md:py-8 lg:py-12 px-4 sm:px-6 md:px-12 lg:px-20">
            <div className="flex flex-col-reverse md:flex-row justify-around ">
                <div className="flex flex-col md:w-1/4 mt-10 md:mt-0 lg:w-1/3">
                    <h2 className={`${DMSans.className} footer-heading`}>Join our newsletter for exclusive deals!</h2>
                    <input type="text"
                        placeholder="Subscribe"
                        className="bg-calm-green text-dark-brown outline-none 
                        rounded-xl px-2 py-4 mt-5 "
                    />
                    <p className="mt-2 text-xs lg:text-sm">We’ll notify you whenever special deals are available. Don’t miss exclusive discounts on your favorite bonsai and kits.</p>
                </div>
                <div className="flex justify-between md:justify-around lg:justify-evenly w-full">
                    <div>
                        <h4 className={`${DMSans.className} footer-heading`}>Address</h4>
                        <div className={`${ManRope.className} footer-nav`}>
                            <p>21 Revolution Street, Paris, France</p>
                            <p>+1 555 123456</p>
                            <p>zentree@gmail.com</p>
                        </div>
                    </div>
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
                        <h4 className={`${DMSans.className} footer-heading`}>Customer Service</h4>
                        <div className={`${ManRope.className} footer-nav`}>
                            <p>FAQs</p>
                            <p>Track Order</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-evenly mt-20">
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
