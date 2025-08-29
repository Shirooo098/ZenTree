import { cva, VariantProps } from "class-variance-authority"
import Image from "next/image"
import cn from "../util/cn";

import ZenTreeLogo from './../../public/img/Logo.png';

const logoVariants = cva("", {
    variants: {
        size: {
            sm: "size-[60px] md:size-[80px]",
            md: "size-[90px] md:size-[120px]",
            lg: "size-[120px] md:size-[150px]",
            nav: "size-auto",
        },
        align: {
            center: "mx-auto",
            left: "ml-0",
            right: "mr-0",
        },
        objectFit: {
            contain: "object-contain",
        },
        
    },
    defaultVariants: {
        size: "md",
        align: "center",
        objectFit: "contain"
  },
})

type LogoProps = VariantProps<typeof logoVariants>

export default function Logo({ size, align }: LogoProps){
    return(
        <Image
            loading='eager'
            priority={true}
            src={ZenTreeLogo}
            alt="ZenTree Logo"
            width={120}
            height={120}
            className={cn(logoVariants({size, align}))}
        />
    )
}