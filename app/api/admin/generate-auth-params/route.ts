import { auth } from "@/app/lib/auth";
import { imagekit } from "@/config/config-imageKit";
import { getCurrentUser } from "@/server/users";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req: Request){
    try {
        const user = await getCurrentUser()

        if(!user) return NextResponse.redirect(new URL("/sign-in", req.url))

        if (user.role !== "admin" && user.role !== "staff") return NextResponse.redirect(new URL("/", req.url));


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