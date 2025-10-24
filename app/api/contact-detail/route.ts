import { db } from "@/db/drizzle";
import { contact_detail } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(contact_detail).limit(1);
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact details" + error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { location, phone, email } = await req.json();
    const [existing] = await db.select().from(contact_detail).limit(1);

    if (existing) {
      await db
        .update(contact_detail)
        .set({ location, phone, email })
        .where(eq(contact_detail.id, existing.id));
    } else {
      await db.insert(contact_detail).values({ location, phone, email });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact details" + error }, { status: 500 });
  }
}
