'use client';

import Link from 'next/link'
import Button from '../../../ui/button'
import { signUp } from '@/server/users'
import { PiGoogleLogoBold } from "react-icons/pi";

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { signInWithGoogle } from '@/app/lib/auth-client';
import { Loader } from '../../loader/loader';
import Logo from '../../../ui/Logo';

import { toast } from "sonner"

const formSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters"),
    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be at least 50 characters'),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
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
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setError(null)
            setIsSubmitting(true);

            const fullName = `${values.firstName} ${values.lastName}`.trim();

            const result = await signUp(values.email, values.password, values.username, fullName)

            if(result.success) {
                toast("Sign-Up Success, Verify your email before signing-in");
                router.push('/profile')
            }else{
                setError(result.message || "Sign-up Failed")
            };
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
                className="flex flex-col py-4 px-6 w-[350px] md:w-[400px] lg:w-[450px]
                bg-main-white text-dark-brown rounded-lg" >
                <Logo />
                <h1 className="text-center text-lg sm:text-xl lg:text-2xl font-bold">Sign-Up Form</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    <div className="flex flex-col">
                        <label htmlFor="First Name" className='label-style'>First Name:</label>
                        <input type="text" 
                            placeholder='John Doe'
                            {...register('firstName')}
                    className='input-style text-start'/>
                    {errors.firstName && <span className="error-span">{errors.firstName.message}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="Last Name" className='label-style'>Last Name:</label>
                        <input type="text" 
                            placeholder='Jackson'
                            {...register('lastName')}
                    className='input-style text-start'/>
                        {errors.lastName && <span className="error-span">{errors.lastName.message}</span>}
                    </div>
                </div>

                <label htmlFor="Username" className='label-style'>Username:</label>
                <input type="text" 
                    placeholder='johndoe'
                    {...register('username')}
               className='input-style'/>
                {errors.username && <span className="error-span">{errors.username.message}</span>}
                <label htmlFor="Email" className='label-style'>Email:</label>
                <input type="text" 
                    placeholder='johndoe@gmail.com'
                    {...register('email')}
                    className="input-style"/>
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                <label htmlFor="Password" className='label-style'>Password:</label>
                <input type="password" 
                    placeholder='********'
                    {...register('password')}
                    className='input-style'/>
                {errors.password && <span className="error-span">{errors.password.message}</span>}

                <label htmlFor="Confirm Password" className='label-style'>Confirm Password:</label>
                <input type="password" 
                    placeholder='********'
                    {...register('confirmPassword')}
                    className='input-style'/>
                {errors.confirmPassword && <span className="error-span">{errors.confirmPassword.message}</span>}
                
                {error && <div className="error-span text-start mb-4">{error}</div>}
                <Button disabled={isSubmitting} variant="primary" size="md" className='inline-flex justify-center items-center mt-5 p-2'>
                    {isSubmitting ? <Loader /> : "Sign-Up"}
                </Button>


                <div className='relative flex items-center mt-2'>
                    <div className="grow border-t border-black"></div>
                    <span className='capitalize text-center px-2 text-sm'> or continue with</span>
                    <div className='grow border-t '></div>
                </div>

                <Button type="button" onClick={signInWithGoogle} variant='secondary' size="md" className='mt-2 p-2 inline-flex justify-center items-center gap-2'>
                        <PiGoogleLogoBold />
                        Sign In with Google
                </Button>
                <p className='capitalize mt-4 text-center text-xs md:text-sm lg:text-base'>Already Have an Account? | <Link href='/sign-in' className='text-blue-800'>Sign-in</Link></p>
            </form>
        </>
    )
}