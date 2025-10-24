import { db } from "@/db/drizzle";
import { faq_hero } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(faq_hero).limit(1);
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQ hero" + error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { title, description} = await req.json();
    const [existing] = await db.select().from(faq_hero).limit(1);

    if (existing) {
      await db
        .update(faq_hero)
        .set({ title, description })
        .where(eq(faq_hero.id, existing.id));
    } else {
      await db.insert(faq_hero).values({ title, description });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ hero" + error }, { status: 500 });
  }
}
