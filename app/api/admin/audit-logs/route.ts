import { db } from "@/db/drizzle";
import { audit_log, user } from "@/db/schema";
import { desc, eq, sql, and } from "drizzle-orm"; 
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/server/users";

export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const session = await getCurrentUser();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 50;
    const tableName = searchParams.get('table');
    const action = searchParams.get('action');

    const offset = (page - 1) * limit;

    // Build filter conditions
    const conditions = [];
    if (tableName) {
      conditions.push(eq(audit_log.table_name, tableName));
    }
    if (action) {
      conditions.push(eq(audit_log.action, action));
    }

    // Build the base query with $dynamic()
    let logsQuery = db
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
      .$dynamic();

    // Apply filters if they exist
    if (conditions.length > 0) {
      logsQuery = logsQuery.where(
        conditions.length === 1 ? conditions[0] : and(...conditions)
      );
    }

    // Get logs with pagination
    const logs = await logsQuery
      .orderBy(desc(audit_log.created_at))
      .limit(limit)
      .offset(offset);

    // Build count query with $dynamic()
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(audit_log)
      .$dynamic();

    // Apply same filters to count query
    if (conditions.length > 0) {
      countQuery = countQuery.where(
        conditions.length === 1 ? conditions[0] : and(...conditions)
      );
    }

    const [{ count }] = await countQuery;

    const total = Number(count);
    const pages = Math.ceil(total / limit);

    // Parse JSON fields
    const parsedLogs = logs.map(log => ({
      ...log,
      old_values: log.old_values ? JSON.parse(log.old_values as string) : null,
      new_values: log.new_values ? JSON.parse(log.new_values as string) : null,
      metadata: log.metadata ? JSON.parse(log.metadata as string) : null,
        created_at: log.created_at
          ? new Date(log.created_at).toLocaleString("en-PH", {
              timeZone: "Asia/Manila",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : null,
    }));

    return NextResponse.json({
      logs: parsedLogs,
      total,
      page,
      pages,
      limit,
    });

  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}