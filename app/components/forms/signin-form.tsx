'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '../../ui/button'
import { PiGoogleLogoBold } from "react-icons/pi";
import { signIn } from '@/server/users';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password is required")
})

export default function SignInForm(){
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>){
            console.log(values)
    }

    return(
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col py-4 px-6 w-[300px] sm:w-[400px] lg:w-[480px] bg-main-white text-dark-brown rounded-lg">
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
            <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold">Sign-In Form</h1>
            <label htmlFor="Email" className='mt-4 font-bold text-base sm:text-lg lg:text-xl'>Email:</label>
            <input type="text" 
                {...register('email')}
                className="outline-none border-0 px-1 
                focus:ring-0 placeholder:text-center
                placeholder:text-lg border-b border-black focus:border-black bg-transparent
                text-lg xs:text-xl sm:text-2xl;"/>
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            <label htmlFor="Password" className='mt-4 font-bold text-base sm:text-lg lg:text-xl'>Password:</label>
            <input type="password" 
                {...register('password')}
                className="outline-none border-0 px-1  focus:ring-0 placeholder:text-center
                placeholder:text-lg border-b border-black focus:border-black bg-transparent
                text-lg xs:text-xl sm:text-2xl;" />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            <Button onClick={signIn} variant="secondary" size="md" className=' mt-5 p-2'>Sign-In</Button>
            <Button variant='primary' size="md" className='mt-5 p-2 inline-flex justify-center items-center gap-2'>
                <PiGoogleLogoBold />
                Sign In with Google
            </Button>
            <p className='capitalize mt-4 text-center'>Don&apos;t Have an Account? | <Link href='/sign-up' className='text-blue-800'>Sign-Up</Link></p>

        </form>
    )
}