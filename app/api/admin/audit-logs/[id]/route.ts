import { db } from "@/db/drizzle";
import { audit_log, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/users";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentUser();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    if (session.role !== "admin" && session.role !== "staff") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Staff access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const logId = Number(id);

    if (isNaN(logId)) {
      return NextResponse.json(
        { error: "Invalid log ID" },
        { status: 400 }
      );
    }

    const [log] = await db
      .select({
        id: audit_log.id,
        user_id: audit_log.user_id,
        user_name: user.name,
        user_email: user.email,
        action: audit_log.action,
        table_name: audit_log.table_name,
        record_id: audit_log.record_id,
        old_values: audit_log.old_values,
        new_values: audit_log.new_values,
        ip_address: audit_log.ip_address,
        user_agent: audit_log.user_agent,
        metadata: audit_log.metadata,
        created_at: audit_log.created_at,
      })
      .from(audit_log)
      .leftJoin(user, eq(audit_log.user_id, user.id))
      .where(eq(audit_log.id, logId))
      .limit(1);

    if (!log) {
      return NextResponse.json(
        { error: "Audit log not found" },
        { status: 404 }
      );
    }

    const parsedLog = {
      ...log,
      old_values: log.old_values ? JSON.parse(log.old_values as string) : null,
      new_values: log.new_values ? JSON.parse(log.new_values as string) : null,
      metadata: log.metadata || null,
    };

    return NextResponse.json(parsedLog);

  } catch (error) {
    console.error("Error fetching audit log:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit log" },
      { status: 500 }
    );
  }
}