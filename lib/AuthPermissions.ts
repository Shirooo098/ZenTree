// lib/rbac-middleware.ts
import { getCurrentUser } from "@/server/users";
import { NextRequest, NextResponse } from "next/server";

export type UserRole = 'user' | 'staff' | 'admin';
export type Action = 'create' | 'read' | 'update' | 'delete';

interface RBACConfig {
  allowedRoles: UserRole[];
  action: Action;
}

export async function checkPermission(
  req: NextRequest,
  config: RBACConfig
): Promise<{ authorized: boolean; session: any; error?: NextResponse }> {
  const session = await getCurrentUser();

  if (!session) {
    return {
      authorized: false,
      session: null,
      error: NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      ),
    };
  }

  // Check if user role is allowed
  if (!config.allowedRoles.includes(session.role as UserRole)) {
    return {
      authorized: false,
      session,
      error: NextResponse.json(
        { error: `Forbidden - ${config.action} requires ${config.allowedRoles.join(' or ')} role` },
        { status: 403 }
      ),
    };
  }

  // Special check for delete operations - only admin
  if (config.action === 'delete' && session.role !== 'admin') {
    return {
      authorized: false,
      session,
      error: NextResponse.json(
        { error: "Forbidden - Only admins can delete records" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, session };
}

export async function requireAdmin(req: NextRequest) {
  return checkPermission(req, { allowedRoles: ['admin'], action: 'read' });
}

export function withRBAC(
  handler: (req: NextRequest, session: any, ...args: any[]) => Promise<NextResponse>,
  config: RBACConfig
) {
  return async (req: NextRequest, ...args: any[]) => {
    const { authorized, session, error } = await checkPermission(req, config);

    if (!authorized) {
      return error!;
    }

    return handler(req, session, ...args);
  };
}