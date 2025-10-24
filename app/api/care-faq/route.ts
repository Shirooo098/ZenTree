import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { care_faq } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const faqs = await db.select().from(care_faq).orderBy(care_faq.id);
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete FAQ: ${error}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const inserted = await db.insert(care_faq).values({ title, description });
    return NextResponse.json({ success: true, faq: inserted });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete FAQ: ${error}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description } = await req.json();
    await db.update(care_faq).set({ title, description }).where(eq(care_faq.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete FAQ: ${error}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.delete(care_faq).where(eq(care_faq.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete FAQ: ${error}` }, { status: 500 });
  }
}
