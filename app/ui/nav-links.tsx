'use client';

import Link from "next/link";
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { NavLink } from "../types/definition";


interface NavLinkProps{
    links: NavLink[],
    showIcons?: boolean
}
export default function NavLinks({ links, showIcons = false } : NavLinkProps){
    const pathname = usePathname();


    return(
       <>
            {links.map((link) => {
                const IconComponent = link.icon;

                return(
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(`text-dark-brown flex justify-start grow lg:justify-center
                             text-base py-2 lg:py-0 sm:text-lg md:text-xl`,
                            {
                                'font-bold': pathname === link.href,
                                'px-2 lg:px-3': showIcons && IconComponent,
                                'px-1' : !showIcons || !IconComponent
                            }

                        )}
                    >
                        {showIcons && IconComponent ? (
                            <IconComponent size={26} className="text-dark-brown" />
                        ) : (
                            <p>{link.name}</p>
                        )}
                    </Link>
                )
            })}
       </>
    )
}



