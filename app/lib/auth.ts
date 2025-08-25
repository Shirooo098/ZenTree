import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema"
import { Resend } from "resend"
import EmailVerify from "../components/emails/verify-email";
import { username, admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, user } from "./auth/permissions"


const resend = new Resend(process.env.ZENTREE_RESEND_API_KEY as string)

export const auth = betterAuth({
    // emailVerification: {
    //     sendVerificationEmail: async({ user, url }) => {
    //         try {
    //             const { data, error } = await resend.emails.send({
    //                 from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    //                 to: user.email,
    //                 subject: "Verify your email address",
    //                 react: EmailVerify({ username: user.name, verifyUrl: url})
    //             })
    //             if (error) {
    //                 console.error('Failed to send verification email:', error);
    //                 throw error;
    //             }

    //             console.log('Verification email sent:', data);
    //         } catch (error) {
    //             console.error('Error in sendVerificationEmail:', error);
    //             throw error; 
    //         }

            
    //     },
    //     autoSignInAfterVerification: true,
    //     sendOnSignUp: true
    // },
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
        // requireEmailVerification: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    plugins: [
        nextCookies(),
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
    ],
    trustedOrigins: [ process.env.BETTER_AUTH_URL as string ,"http://localhost:3000"],
    rateLimit: {
        enabled: true,
        window: 30,
        max: 50,
    },
    
});
