
import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { imageKit_productFiles } from "@/db/schema";
import { getCurrentUser } from "@/server/users";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const session = await getCurrentUser();

        if(!session) return NextResponse.redirect(new URL("/sign-in", req.url));
        if(session.role !== "admin" && session.role !== "staff") return NextResponse.redirect(new URL("/", req.url));
       
        const userId = session.id;
        const { fileId, url } = await req.json();

        if (!fileId || !url) {
            throw new Error('fileId and url are required from ImageKit response');
        }
        
        const [newRecord] = await db.insert(imageKit_productFiles)
            .values({
                product_image_id: fileId,
                product_image_url: url,
                user_id: userId
            })
            .returning({ id: imageKit_productFiles.id }); 

        return NextResponse.json({
            success: true, 
            id: newRecord.id 
        });
    } catch (error) {
        console.error('Metadata Save Error:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { success: false, error: "Failed to save metadata" },
            { status: 500 }
        );
    }
}