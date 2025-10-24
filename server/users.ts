'use server'

import { auth } from "@/app/lib/auth"
import { getUserRole } from "@/app/util/user-role.action"
import { db } from "@/db/drizzle"
import { account, order_status, orders, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
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
    dateThreshold.setHours(dateThreshold.getHours() - 24); // More precise 24-hour window

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
export async function createUser(data: {
  name: string;
  email: string;
  username?: string;
  password: string;
  role: "admin" | "staff";
  phoneNumber?: string;
}) {
  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, data.email),
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    if (data.username) {
      const existingUsername = await db.query.user.findFirst({
        where: eq(user.username, data.username),
      });

      if (existingUsername) {
        throw new Error("Username already exists");
      }
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await hash(data.password, 10);

    await db.insert(user).values({
      id: userId,
      name: data.name,
      email: data.email,
      username: data.username || null,
      displayUsername: data.username || null,
      role: data.role,
      phoneNumber: data.phoneNumber || null,
      emailVerified: true, 
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      banned: false,
      banReason: null,
      banExpires: null,
    });

    // Create account with password
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId: userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}