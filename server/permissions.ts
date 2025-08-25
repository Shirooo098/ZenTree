"use server";

import { auth } from "@/app/lib/auth";


export const isAdmin = async(userId: string) => {
    try {
        await auth.api.userHasPermission({
            body: {
                userId,
                role: "admin",
                permission: { "project" : ['create', 'update'] },

            }
        })
    } catch (error) {
        
    }
}