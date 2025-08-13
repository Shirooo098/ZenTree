'use client';

import Image from 'next/image'
import Link from 'next/link'
import Button from '../../ui/button'
import { signUp } from '@/server/users'
import { PiGoogleLogoBold } from "react-icons/pi";

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInWithGoogle } from '@/app/lib/auth-client';

const formSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUpForm(){
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register, 
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setError(null)
            setIsSubmitting(true);
            const result = await signUp(values.email, values.password, values.username)

            if(result.success) router.push('/sign-in');
        } catch (error) {
            setError(error instanceof Error? error.message: "An unknown error occured")

        } finally{
            setIsSubmitting(false)
        }
    }

    return(
        <>
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col py-4 px-6 w-[260px] xs:w-[280px] sm:w-[320px] lg:w-[380px]
                bg-main-white text-dark-brown rounded-lg" >
                <Image
                    loading='eager'
                    priority={true}
                    src={"/img/Logo.png"}
                    alt="ZenTree Logo"
                    width={120}
                    height={120}
                    className='mx-auto size-[90px] md:size-[120px] lg:size-[120px]'
                />
                <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold">Sign-Up Form</h1>
                <label htmlFor="Username" className='label-style'>Username:</label>
                <input type="text" 
                    {...register('username')}
               className='input-style'/>
                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                <label htmlFor="Email" className='label-style'>Email:</label>
                <input type="text" 
                    {...register('email')}
                    className="input-style"/>
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                <label htmlFor="Password" className='label-style'>Password:</label>
                <input type="password" 
                    {...register('password')}
                    className='input-style'/>
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                {error && <div className="text-red-500 text-start mb-4">{error}</div>}
                <Button disabled={isSubmitting} variant="secondary" size="md" className='mt-5 p-2'>Sign Up</Button>
                <Button type="button" onClick={signInWithGoogle} variant='primary' size="md" className='mt-5 p-2 inline-flex justify-center items-center gap-2'>
                        <PiGoogleLogoBold />
                        Sign In with Google
                </Button>
                <p className='capitalize mt-4 text-center text-xs md:text-sm lg:text-base'>Already Have an Account? | <Link href='/sign-in' className='text-blue-800'>Sign-in</Link></p>
            </form>
        </>
    )
}