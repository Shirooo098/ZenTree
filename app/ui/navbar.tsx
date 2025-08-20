'use client';

import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link"
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { DMSans } from "./fonts";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <nav className={`${DMSans.className} inset-shadow-nav bg-main-white w-full px-8 rounded-md`}>
            <div className="flex flex-row items-center justify-between w-full">
                <div className="relative size-[65px] md:size-[80px] lg:size-[100px]">
                    <Link href="/"> 
                            <Image
                            priority={true}
                            loading="eager"
                            src={'/img/Logo.png'}
                            alt="ZenTree Logo"
                            height={100}
                            width={100}
                            className="object-contain size-[65px] md:size-[80px] lg:size-[100px] "
                        />
                    </Link>
                </div>

                {/* Desktop navigation (mobile view) */}
                <div className="hidden lg:flex w-[60vw] justify-between">
                    <NavLinks />
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
                    <NavLinks />
                </div>
            )}
        </nav>
    )
}