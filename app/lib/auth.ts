import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema"
import { Resend } from "resend"
import EmailVerify from "../components/emails/verify-email";

const resend = new Resend(process.env.ZENTREE_RESEND_API_KEY as string)

export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async({ user, url }) => {
            try {
                const { data, error } = await resend.emails.send({
                    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                    to: user.email,
                    subject: "Verify your email address",
                    react: EmailVerify({ username: user.name, verifyUrl: url})
                })
                if (error) {
                    console.error('Failed to send verification email:', error);
                    throw error;
                }

                console.log('Verification email sent:', data);
            } catch (error) {
                console.error('Error in sendVerificationEmail:', error);
                throw error; 
            }

            
        },
        sendOnSignUp: true
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    plugins: [nextCookies()],
    trustedOrigins: ["http://localhost:3000"]
});