import { db } from "@/db/drizzle";
import { faq_hero } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(faq_hero).limit(1);
    return Response.json(data[0]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to fetch FAQ hero" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
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

    return Response.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to update FAQ hero" }, { status: 500 });
  }
}
