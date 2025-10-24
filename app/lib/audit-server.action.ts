"use server";

import { db } from "@/db/drizzle";
import { audit_log } from "@/db/schema";
import { getCurrentUser } from "@/server/users";
import { headers } from "next/headers";

/**
 * Get request metadata (IP address and user agent)
 */
export async function getRequestMetadata() {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ipAddress = forwarded ? forwarded.split(',')[0] : 
                    headersList.get('x-real-ip') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Create an audit log entry
 */
export async function createAuditLog({
  userId,
  action,
  tableName,
  recordId,
  oldValues,
  newValues,
  ipAddress,
  userAgent
}: {
  userId: string;
  action: 'create' | 'update' | 'delete';
  tableName: string;
  recordId: string | number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}) {
  try {
    await db.insert(audit_log).values({
      user_id: userId,
      action,
      table_name: tableName,
      record_id: String(recordId),
      old_values: oldValues ? JSON.stringify(oldValues) : null,
      new_values: newValues ? JSON.stringify(newValues) : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - we don't want audit logging to break the main operation
  }
}

/**
 * Check if user is authenticated and has required role
 * Returns session if authorized, or error response if not
 */
export async function checkPermission(allowedRoles: string[]) {
  const session = await getCurrentUser();
  
  if (!session) {
    return {
      authorized: false,
      session: null,
      error: {
        message: "Unauthorized - Please log in",
        errors: {}
      }
    };
  }

  // Check if role exists and is in allowed roles
  if (!session.role || !allowedRoles.includes(session.role)) {
    return {
      authorized: false,
      session: null,
      error: {
        message: `Forbidden - ${allowedRoles.join(' or ')} access required`,
        errors: {}
      }
    };
  }

  return {
    authorized: true,
    session,
    error: null
  };
}

/**
 * Check if user is admin only (for delete operations)
 */
export async function requireAdmin() {
  const session = await getCurrentUser();
  
  if (!session) {
    return {
      authorized: false,
      session: null,
      error: {
        message: "Unauthorized - Please log in",
        errors: {}
      }
    };
  }

  // Check if role exists and is admin
  if (!session.role || session.role !== "admin") {
    return {
      authorized: false,
      session: null,
      error: {
        message: "Forbidden - Only admins can perform this action",
        errors: {}
      }
    };
  }

  return {
    authorized: true,
    session,
    error: null
  };
}

/**
 * Check if user is admin or staff
 */
export async function requireAdminOrStaff() {
  return checkPermission(['admin', 'staff']);
}