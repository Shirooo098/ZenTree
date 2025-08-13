"use server";

import { auth } from "@/app/lib/auth"
 
export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/"
            },


        })

        return { 
            success: true, 
            message: "Signed in successfully.",
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: { error: e.message || "An unknown error occured."}
        }
    }
}

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "user@email.com",
            password: "password",
            name: "User Demo"
        }
    })
}