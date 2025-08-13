import Image from 'next/image'
import Link from 'next/link'

export default function SignUpForm(){
    return(
        <>
            <form className="flex flex-col py-4 px-6 w-[300px] sm:w-[400px] lg:w-[480px] bg-main-white text-dark-brown rounded-lg" >
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
                <button className="w-full mt-5 p-2 rounded-md bg-dark-brown text-main-white">Sign Up</button>

                <p className='capitalize mt-4 text-center'>Already Have an Account? | <Link href='/sign-in' className='text-blue-800'>Sign-in</Link></p>
            </form>
        </>
    )
}