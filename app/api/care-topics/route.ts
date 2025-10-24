import { db } from "@/db/drizzle";
import { care_topics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const topics = await db.select().from(care_topics).orderBy(care_topics.id);
    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch Care Topics ${error}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const inserted = await db.insert(care_topics).values({ title, description});
    return NextResponse.json({ success: true, topic: inserted });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add Care Topic" + error }, { status: 500 });
  }
}

  
export async function PUT(req: NextRequest) {
  const { id, title, description } = await req.json();
  await db.update(care_topics).set({ title, description }).where(eq(care_topics.id, id));
  return NextResponse.json({ success: true });
}

  
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await db.delete(care_topics).where(eq(care_topics.id, id));
  return NextResponse.json({ success: true });
}

