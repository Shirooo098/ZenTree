'use client';

import Link from "next/link";
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { NavLink } from "../types/definition";


interface NavLinkProps{
    links: NavLink[]
}
export default function NavLinks({ links } : NavLinkProps){
    const pathname = usePathname();


    return(
       <>
            {links.map((link) => {
                return(
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(`text-dark-brown flex justify-start grow lg:justify-center
                             text-base py-2 lg:py-0 sm:text-lg md:text-xl`,
                            {
                                'font-bold': pathname === link.href
                            }

                        )}
                    >
                        <p>{link.name}</p>
                    </Link>
                )
            })}
       </>
    )
}



