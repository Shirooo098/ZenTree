import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";



export async function getUserRole(email:string): Promise<string>{
    try {
        const users = await db.select({role: user.role})
            .from(user)
            .where(eq(user.email, email))
        

        if(!users || users.length === 0) {
            throw new Error('User not found')
        }

        return users[0].role as string
    } catch (error) {
        console.error("Error fetching user role:", error);
        throw new Error('Failed to retrieve user role');
    }
}