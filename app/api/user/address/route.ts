import { auth } from "@/app/lib/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { address } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if(!session){
            return NextResponse.json(
                { error: "Unauthorized"}, 
                { status: 401 }
            )
        }
        const userAddress = await db
            .select()
            .from(address)
            .where(eq(address.user_id, session.user.id))
            .limit(1);

        return NextResponse.json({ address: userAddress[0] || null });
        
    } catch (error) {
        console.error('Error fetching address:', error);
        return NextResponse.json(
            { error: "Failed to fetch address" },
            { status: 500 }
        );
    }
}