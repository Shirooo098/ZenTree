"use server";

import { auth } from "@/app/lib/auth"
import { SignInResult } from "@/app/types/definition";
 
export const signIn = async (email: string, password: string): Promise<SignInResult> => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/"
            },


        })

        return { success: true, error: null}
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Login Failed"
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