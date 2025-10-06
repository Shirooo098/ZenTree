'use server'

import { auth } from "@/app/lib/auth"
import { getUserRole } from "@/app/util/user-role.action"
import { db } from "@/db/drizzle"
import { order_status, orders, user } from "@/db/schema";
import { sql } from "drizzle-orm";


export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            },
        })
        
        const userRole = await getUserRole(email)

        return { 
            success: true, 
            message: "Signed-In Successfully.",
            role: userRole
        }

    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "An unknown error occured."
        }
    }
}

export const signUp = async (email: string, password: string, username: string, name: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                username
            },
        })
        return{
            success: true,
            message: "Signed-Up Successfully"
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "An unknown error occured."
        }
    }
}

export const getAllUsers = async () => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 1); 

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        displayUsername: user.displayUsername,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        phoneNumber: user.phoneNumber,
        cancellationCount: sql<number>`
          COALESCE(
            (SELECT COUNT(*) 
             FROM ${orders} o
             INNER JOIN ${order_status} os ON o.order_status_id = os.order_status_id
             WHERE o.user_id = ${user.id}
             AND os.order_status_name = 'Cancelled'
             AND o.created_at >= ${dateThreshold}
            ), 0
          )
        `.as('cancellation_count')
      })
      .from(user);

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};