'use server'

import { auth } from "@/app/lib/auth"
import { getUserRole } from "@/app/util/user-role.action"
import { db } from "@/db/drizzle"
import { account, order_status, orders, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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

export const signUp = async (
  email: string,
  password: string,
  username: string,
  name: string,
  role?: string,
  phoneNumber?: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
                username
            },
        })

        console.log("Role:", role)
         await db
          .update(user)
          .set({
            role: role ?? "user",
            phoneNumber: phoneNumber ?? null,
          })
          .where(eq(user.email, email));
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
    dateThreshold.setHours(dateThreshold.getHours() - 24);

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
             AND LOWER(os.order_status_name) = 'cancelled'
             AND o.created_at >= ${dateThreshold.toISOString()}
            ), 0
          )
        `.as('cancellation_count')
      })
      .from(user);

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const currentUser = await db.query.user.findFirst({
        where: eq(user.id, session.user.id),
    });

    if (!currentUser) {
        redirect("/sign-in");
    }
    
    return {
        id: session.user.id,
        name: session.user.name,
        username: session.user.username,
        phoneNumber: currentUser.phoneNumber,
        email: session.user.email,
        avatar: session.user.image,
        role: session.user.role
    }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(user).where(eq(user.id, userId));
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}
export async function updateUser(
  userId: string,
  data: {
    name: string;
    email: string;
    username: string | null;
    role: string;
    phoneNumber: string | null;
  }
) {
  try {
    await db
      .update(user)
      .set({
        name: data.name,
        email: data.email,
        username: data.username,
        displayUsername: data.username,
        role: data.role,
        phoneNumber: data.phoneNumber,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
}