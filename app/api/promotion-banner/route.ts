import { db } from "@/db/drizzle";
import { promotion_banner } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
  const data = await db.select().from(promotion_banner).limit(1);
  return NextResponse.json(data[0] || {});
}


export async function PUT(req: Request) {
  const body = await req.json();
  const { title, subtitle, discount_text, show_banner } = body;


  const bannerVisibility = show_banner ?? true;

  const existing = await db.select().from(promotion_banner).limit(1);

  if (existing.length > 0) {
    await db
      .update(promotion_banner)
      .set({
        title,
        subtitle,
        discount_text,
        show_banner: bannerVisibility, 
      })
      .where(eq(promotion_banner.id, existing[0].id));
  } else {
    await db.insert(promotion_banner).values({
      title,
      subtitle,
      discount_text,
      show_banner: bannerVisibility,
    });
  }

  return NextResponse.json({
    success: true,
    message: bannerVisibility
      ? "Promotion banner updated and visible!"
      : "Promotion banner hidden!",
  });
}
