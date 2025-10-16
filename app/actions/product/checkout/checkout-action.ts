'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";


export async function createDirectCheckout() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) throw new Error("Please login first before checking out.");
    

    
}