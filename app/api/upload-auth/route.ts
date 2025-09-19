// File: app/api/upload-auth/route.ts
import { auth } from "@/app/lib/auth"
import { getUploadAuthParams } from "@imagekit/next/server"
import { redirect } from "next/navigation";
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) redirect ("/sign-in");

    if(session.user.role !== "admin") redirect ("/");

    const { expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
        expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
        // token: "random-token", Optional, a unique token for request
    })

    return Response.json({  expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
}