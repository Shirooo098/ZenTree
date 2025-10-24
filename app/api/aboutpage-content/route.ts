import { db } from "@/db/drizzle";
import { aboutpage_content } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  try {
    const [content] = await db.select().from(aboutpage_content).limit(1);


    if (!content) {
      return NextResponse.json({
        hero_title: "",
        hero_desc: "",
        what_title: "",
        what_desc: "",
        vision_title: "",
        vision_desc: "",
        mission_title: "",
        mission_desc: "",
      });
    }


    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /aboutpage-content failed:", error);
    return NextResponse.json({ error: "Failed to fetch About page content" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();


    const [existing] = await db.select().from(aboutpage_content).limit(1);


    if (existing) {
      // Update first record
      await db
        .update(aboutpage_content)
        .set({
          ...body,
          updated_at: new Date(),
        })
        .where(eq(aboutpage_content.id, existing.id));
    } else {
      // Create one if missing
      await db.insert(aboutpage_content).values({
        ...body,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }


    return NextResponse.json({ message: "About page content updated successfully!" });
  } catch (error) {
    console.error("PUT /aboutpage-content failed:", error);
    return NextResponse.json({ error: "Failed to update About page content" }, { status: 500 });
  }
}
