'use client';

import NavLinks from "./nav-links";
import Image from "next/image";
import { AlignJustify } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <nav className="inset-shadow-nav bg-main-white w-full px-8 rounded-md">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="relative w-[100px] h-[100px]">
                    <Image
                        priority={true}
                        loading="eager"
                        src={'/img/Logo.png'}
                        alt="ZenTree Logo"
                        fill
                        sizes="100px"
                        className="object-contain h-[100px]"
                    />
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