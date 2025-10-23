import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { faqs } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const allFaqs = await db
      .select()
      .from(faqs)
      .orderBy(asc(faqs.category), asc(faqs.id));
    return NextResponse.json(allFaqs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { category, title, description } = await req.json();
    await db.insert(faqs).values({ category, title, description });
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to add FAQ" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, category, title, description } = await req.json();
    await db
      .update(faqs)
      .set({ category, title, description })
      .where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
