import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { refund } from "@/db/schema";
import { eq } from "drizzle-orm"; // ✅ import eq helper

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const refundId = Number(id);
  const body = await req.json();
  const { status } = body;

  if (!status) {
    return NextResponse.json(
      { error: "Status is required" },
      { status: 400 }
    );
  }

  try {
    const updated = await db
      .update(refund)
      .set({ status })
      .where(eq(refund.refund_id, refundId)) // ✅ use eq helper
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating refund:", err);
    return NextResponse.json(
      { error: "Failed to update refund" },
      { status: 500 }
    );
  }
}
