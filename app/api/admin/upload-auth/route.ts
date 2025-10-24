  
import { getUploadAuthParams } from "@imagekit/next/server"
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/users";

export async function GET() {
    const session = await getCurrentUser()

    if(!session) redirect ("/sign-in");

    if(session.role !== "admin" && session.role !== "staff") redirect ("/");

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,   
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
          
          
    })

    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
}