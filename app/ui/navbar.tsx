'use client';

import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link"
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { DMSans } from "./fonts";
import { centerSideLinks, rightSideLinks } from "../types/definition";

export default function NavBar() { 
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <nav className={`${DMSans.className} inset-shadow-nav bg-main-white h-full w-full px-8 rounded-md`}>
            <div className="flex items-center justify-between w-full">
                <div className="relative flex justify-center items-center size-[65px] md:size-[75px] lg:size-[85px]">
                    <Link href="/"> 
                        <Image
                            priority
                            loading="eager"
                            src={'/img/Logo.png'}
                            alt="ZenTree Logo"
                            height={100}
                            width={90}
                            className="object-contain size-auto"

                        />
                    </Link>
                </div>

                {/* Desktop navigation (mobile view) */}
                <div className="hidden lg:flex w-[40vw] justify-center">
                    <NavLinks links={centerSideLinks}/>
                </div>

                <div className="hidden lg:flex justify-end space-x-6">
                    <NavLinks links={rightSideLinks} showIcons={true}/>
                </div>

                {/* Hidden Menu Bar on Desktop viewport */}
                <div className="lg:hidden flex items-center">
                    <button onClick={toggleMenu}>
                        <AlignJustify color="var(--color-dark-brown)"/>
                    </button>
                </div>
            </div>

            {/* Menu in Mobile viewport */}
            {isOpen && (
                <div className="lg:hidden flex flex-col">
                    <NavLinks links={centerSideLinks} />
                    <div className="my-4 border-t pt-4">
                        <NavLinks links={rightSideLinks} />
                    </div>
                </div>
            )}
        </nav>
    )
}