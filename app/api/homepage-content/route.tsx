import { db } from "@/db/drizzle";
import { homepage_content } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    const content = await db.select().from(homepage_content).limit(1);
    return NextResponse.json(content[0]);
  } catch (error) {
    console.error("GET /homepage-content failed:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { quote1, quote2, quote3, author } = body;

    // Update the first record (assuming you have one main hero section)
    await db
      .update(homepage_content)
      .set({ quote1, quote2, quote3, author })
      .where(eq(homepage_content.id, 1));

    return NextResponse.json({ message: "Content updated successfully!" });
  } catch (error) {
    console.error("GET /homepage-content failed:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
