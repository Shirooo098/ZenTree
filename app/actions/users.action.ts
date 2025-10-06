'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const banUser = async (
  userId: string, 
  banReason: string, 
  banExpiresIn: number
) => {
  try {
    // Ban the user using auth API
    await auth.api.banUser({
      body: {
        userId,
        banReason,
        banExpiresIn,
      },
      headers: await headers(),
    });

    // Optionally update your database
    const banExpiresDate = new Date(Date.now() + banExpiresIn * 1000);
    
    await db
      .update(user)
      .set({
        banned: true,
        banReason,
        banExpires: banExpiresDate,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      message: "User banned successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.error("Ban user error:", e);
    return {
      success: false,
      message: e.message || "Failed to ban user",
    };
  }
};

export const unbanUser = async (userId: string) => {
  try {
    await auth.api.unbanUser({
      body: { userId },
      headers: await headers(),
    });

    await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    return {
      success: true,
      message: "User unbanned successfully",
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || "Failed to unban user",
    };
  }
};