'use client';

import Image from 'next/image'
import Link from 'next/link'
import Button from '../../ui/button'
import { signUp } from '@/server/users'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const formSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUpForm(){
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>){
        console.log(values)
    }

    return(
        <>
            <form {...form}
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col py-4 px-6 w-[300px] sm:w-[400px] lg:w-[480px] bg-main-white text-dark-brown rounded-lg" >
                <Image
                    loading='eager'
                    priority={true}
                    src={"/img/Logo.png"}
                    alt="ZenTree Logo"
                    width={150}
                    height={150}
                    className='mx-auto'
                    style={{width: 'auto', height: 'auto'}}
                />
                <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold">Sign-Up Form</h1>
                <label htmlFor="Username" className='mt-4 font-bold text-base sm:text-lg lg:text-xl'>Username:</label>
                <input type="text" 
                className="outline-none border-0 px-1  focus:ring-0 placeholder:text-center
                    placeholder:text-lg border-b border-black focus:border-black bg-transparent
                    text-lg xs:text-xl sm:text-2xl;" />
                <label htmlFor="Email" className='mt-4 font-bold text-base sm:text-lg lg:text-xl'>Email:</label>
                <input type="text" className="outline-none border-0 px-1 
                    focus:ring-0 placeholder:text-center
                    placeholder:text-lg border-b border-black focus:border-black bg-transparent
                    text-lg xs:text-xl sm:text-2xl;"/>
                <label htmlFor="Password" className='mt-4 font-bold text-base sm:text-lg lg:text-xl'>Password:</label>
                <input type="password" 
                className="outline-none border-0 px-1  focus:ring-0 placeholder:text-center
                    placeholder:text-lg border-b border-black focus:border-black bg-transparent
                    text-lg xs:text-xl sm:text-2xl;" />
                <Button onClick={signUp} variant="primary" size="md" className='mt-5 p-2'>Sign Up</Button>
                <p className='capitalize mt-4 text-center'>Already Have an Account? | <Link href='/sign-in' className='text-blue-800'>Sign-in</Link></p>
            </form>
        </>
    )
}