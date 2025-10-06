import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { refund } from "@/db/schema";
import { desc } from "drizzle-orm"; // ✅ import desc helper

export async function GET() {
  try {
    // Fetch all refunds and order by created_at descending
    const allRefunds = await db
      .select()
      .from(refund)
      .orderBy(desc(refund.created_at)); 

    return NextResponse.json(allRefunds);
  } catch (err) {
    console.error("Error fetching refunds:", err);
    return NextResponse.json(
      { error: "Failed to fetch refunds" },
      { status: 500 }
    );
  }
}
