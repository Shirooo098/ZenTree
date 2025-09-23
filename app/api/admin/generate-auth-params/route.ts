import { auth } from "@/app/lib/auth";
import { imagekit } from "@/config/config-imageKit";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req: Request){
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if(!session) return NextResponse.redirect(new URL("/sign-in", req.url))

        if (session.user.role !== "admin") return NextResponse.redirect(new URL("/", req.url));


        const authParams = imagekit.getAuthenticationParameters();

        return NextResponse.json({ success: true, ...authParams });
    } catch (error) {
        console.error("Auth Param Generate Error:", error);
        return NextResponse.json({
            success: false, 
            error: "Failed to generate auth params",
        }, { status: 500 })
    } 
    
}