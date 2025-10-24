'use server'

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAuditLog, getRequestMetadata, } from "@/app/lib/audit-server.action";
import { getCurrentUser } from "@/server/users";

export const banUser = async (
  userId: string, 
  banReason: string, 
  banExpiresIn: number
) => {
  try {
    // 1. Check permissions (only admins can ban users)
    const session = await getCurrentUser();
    
    if (!session) {
      return {
        success: false,
        message: "Unauthorized - Please log in",
      };
    }

    if (session.role !== "admin") {
      return {
        success: false,
        message: "Forbidden - Only admins can ban users",
      };
    }

    // 2. Get old user data for audit log
    const [oldUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!oldUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 3. Ban user via auth API
    await auth.api.banUser({
      body: {
        userId,
        banReason,
        banExpiresIn,
      },
      headers: await headers(),
    });

    const banExpiresDate = new Date(Date.now() + banExpiresIn * 1000);
    
    // 4. Update user in database
    const [updatedUser] = await db
      .update(user)
      .set({
        banned: true,
        banReason,
        banExpires: banExpiresDate,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    // 5. Create audit log
    const { ipAddress, userAgent } = await getRequestMetadata();
    await createAuditLog({
      userId: session.id,
      action: 'update',
      tableName: 'user',
      recordId: userId,
      oldValues: {
        banned: oldUser.banned,
        banReason: oldUser.banReason,
        banExpires: oldUser.banExpires,
      },
      newValues: {
        banned: updatedUser.banned,
        banReason: updatedUser.banReason,
        banExpires: updatedUser.banExpires,
      },
      ipAddress,
      userAgent,
      metadata: {
        action_type: 'ban_user',
        target_user_id: userId,
        target_user_email: oldUser.email,
        ban_duration_seconds: banExpiresIn,
        ban_expires_at: banExpiresDate.toISOString(),
      }
    });

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
    // 1. Check permissions (only admins can unban users)
    const session = await getCurrentUser();
    
    if (!session) {
      return {
        success: false,
        message: "Unauthorized - Please log in",
      };
    }

    if (session.role !== "admin") {
      return {
        success: false,
        message: "Forbidden - Only admins can unban users",
      };
    }

    // 2. Get old user data for audit log
    const [oldUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!oldUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // 3. Unban user via auth API
    await auth.api.unbanUser({
      body: { userId },
      headers: await headers(),
    });

    // 4. Update user in database
    const [updatedUser] = await db
      .update(user)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    // 5. Create audit log
    const { ipAddress, userAgent } = await getRequestMetadata();
    await createAuditLog({
      userId: session.id,
      action: 'update',
      tableName: 'user',
      recordId: userId,
      oldValues: {
        banned: oldUser.banned,
        banReason: oldUser.banReason,
        banExpires: oldUser.banExpires,
      },
      newValues: {
        banned: updatedUser.banned,
        banReason: updatedUser.banReason,
        banExpires: updatedUser.banExpires,
      },
      ipAddress,
      userAgent,
      metadata: {
        action_type: 'unban_user',
        target_user_id: userId,
        target_user_email: oldUser.email,
        previous_ban_reason: oldUser.banReason,
      }
    });

    return {
      success: true,
      message: "User unbanned successfully",
    };
  } catch (error) {
    const e = error as Error;
    console.error("Unban user error:", e);
    return {
      success: false,
      message: e.message || "Failed to unban user",
    };
  }
};