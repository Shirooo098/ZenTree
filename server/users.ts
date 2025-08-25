'use server'

import { auth } from "@/app/lib/auth"
import { getUserRole } from "@/app/util/action";


export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            },
        })

        const userRole = await getUserRole(email)

        return { 
            success: true, 
            message: "Signed in successfully.",
            role: userRole
        }

    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "An unknown error occured."
        }
    }
}

export const signUp = async (email: string, password: string, username: string, name: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                username
            },
        })
        return{
            success: true,
            message: "Signed up successfully"
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "An unknown error occured."
        }
    }
}