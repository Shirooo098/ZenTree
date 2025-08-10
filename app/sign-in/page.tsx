'use client';

import Image from 'next/image';
import SignInForm from '../ui/user-account/signin-form';

export default function SignIn(){
    return(
        <>
            <div className='w-full inline-block'>
                <article className="relative w-full h-screen flex justify-center">
                    <Image
                        priority={true}
                        loading='eager'
                        src={'/img/login-bg.jpeg'}
                        alt='ZenTree'
                        fill
                        className=' object-center object-cover -z-10'
                    />
                
                    <div className="size-full flex justify-center items-center z-0">
                        <SignInForm/>
                    </div>
                </article>
            </div>
        </>
    )
}