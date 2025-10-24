import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const { category, title, description } = await req.json();
    await db.insert(faqs).values({ category, title, description });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add FAQ" + error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, category, title, description } = await req.json();
    await db
      .update(faqs)
      .set({ category, title, description })
      .where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" + error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.delete(faqs).where(eq(faqs.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FAQ" + error  }, { status: 500 });
  }
}
