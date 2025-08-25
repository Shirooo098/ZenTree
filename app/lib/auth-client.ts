import { createAuthClient } from "better-auth/react"
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { ac, admin, user } from "./auth/permissions"


export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        usernameClient(),
        adminClient({
            ac, 
            roles: {
                admin, 
                user,
            }
        }),

    ] 

})

export const signInWithGoogle = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile"
    })
}

export const signInWithEmail = async (email: string, password: string) => {
    await authClient.signIn.email({
        email: email,
        password: password
    }, {
        onError: (ctx) => {
            if(ctx.error.status === 403) {
                alert("Please verify your email address")
            }
            alert(ctx.error.message)
        }
    })
}

