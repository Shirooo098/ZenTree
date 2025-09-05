import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema"

import { username, admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "./auth/permissions"
import { sendEmailAction } from "../actions/send-email.action";


// const resend = new Resend(process.env.ZENTREE_RESEND_API_KEY as string)

export const auth = betterAuth({
    socialProviders: {
        google: {
            accessType: "offline",
            prompt: "select_account+consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        expiresIn: 60 * 1,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmailAction({
                to: user.email,
                subject: "Verify Your Email Address",
                meta: {
                    description: "Please verify your email address to complete registration.",
                    link: String(url),
                }
            })
        }
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    plugins: [
        username({
            minUsernameLength: 5,
            displayUsernameValidator: (displayUsername) => {
                return /^[a-zA-Z0-9_-]+$/.test(displayUsername)
            },
            usernameNormalization: (username) => {
                return username.toLowerCase()
                    .replaceAll("0", "o")
                    .replaceAll("3", "e")
                    .replaceAll("4", "a");
            },
            validationOrder: {
                username: "post-normalization",
                displayUsername: "post-normalization",
            }
        }),
        adminPlugin({
            ac,
            roles: {
                admin,
                user,
            }
        }),
        nextCookies(),
    ],
    trustedOrigins: [process.env.BETTER_AUTH_URL as string, "http://localhost:3000"],
    rateLimit: {
        enabled: true,
        window: 30,
        max: 50,
    },
    
});
