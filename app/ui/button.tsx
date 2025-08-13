import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";
import cn from "../util/cn";

interface ButtonProps extends 
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>{
    children: ReactNode;
}

export default function Button({
    children, 
    className, 
    variant, 
    size,
    ...props}
: ButtonProps){
    return (
        <button className={cn(buttonVariants({variant, size, className}))}
            {...props} 
        >
            {children}
        </button>
    )
}


const buttonVariants = cva("rounded-md hover:cursor-pointer transition-colors duration-200", {
    variants: {
        variant: {
            primary: "border-none bg-dark-brown text-main-white hover:bg-hover-dark-brown",
            secondary: "border-none bg-army-brown text-main-white hover:bg-hover-army-brown",
            danger: "border-none text-main-white bg-red-500 hover:bg-red-700"
        },
        size: {
            sm: "text-sm px-1 py-0",
            md: "text-base px-2 py-1",
            lg: "text-xl px-4 py-1"
        },
        defaultVariants: {
            variant: "primary",
            size: "md"
        }
    }
})