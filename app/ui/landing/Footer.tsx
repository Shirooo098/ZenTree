import { DMSans, ManRope } from "../fonts";

export default function Footer() {
  return (
    <>
        <section className="bg-dark-brown h-[50vh] w-full text-calm-green px-5 py-12">
            <div className="flex justify-around">
                <div className="flex flex-col w-1/3">
                    <h2 className={`${DMSans.className} footer-heading`}>Join our newsletter for exclusive deals!</h2>
                    <input type="text"
                        placeholder="Subscribe"
                        className="bg-calm-green text-dark-brown outline-none 
                        rounded-xl px-2 py-4 mt-5 "
                    />
                    <p className="mt-2">We’ll notify you whenever special deals are available. Don’t miss exclusive discounts on your favorite bonsai and kits.</p>
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
                    <h4 className={`${DMSans.className} footer-heading`}>Customer Care</h4>
                    <div className={`${ManRope.className} footer-nav`}>
                        <p>Bonzai</p>
                        <p>Track Order</p>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}
