// lib/AuthPermissionsServer.ts
import { getCurrentUser } from "@/server/users";

export async function requireAdminOrStaff() {
  const session = await getCurrentUser();

  if (!session) {
    return {
      authorized: false,
      session: null,
      error: { message: "Unauthorized - Please log in", status: 401 },
    };
  }

  if (session.role !== "admin" && session.role !== "staff") {
    return {
      authorized: false,
      session,
      error: { message: "Forbidden - Admin or Staff only", status: 403 },
    };
  }

  return { authorized: true, session };
}
