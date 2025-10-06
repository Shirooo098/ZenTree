import { NextResponse } from "next/server";
import { db } from "@/db/drizzle"; 
import { refund } from "@/db/schema";


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const orderId = Number(id);

  const body = await req.json();
  const { user_id, email, reason, comments } = body;

  if (!user_id || !email || !reason) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const newRefund = await db.insert(refund).values({
      order_id: orderId,
      user_id,
      email,
      reason,
      comments,
      status: "pending",
    }).returning();

    return NextResponse.json(newRefund);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit refund" }, { status: 500 });
  }
}
