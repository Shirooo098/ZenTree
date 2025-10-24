import { db } from "@/db/drizzle";
import { care_hero } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(care_hero).limit(1);
    return Response.json(data[0]);
       
  } catch (error) {
    return Response.json({ error: "Failed to fetch Care Hero" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { title, description} = await req.json();
    const [existing] = await db.select().from(care_hero).limit(1);

    if (existing) {
      await db
        .update(care_hero)
        .set({ title, description })
        .where(eq(care_hero.id, existing.id));
    } else {
      await db.insert(care_hero).values({ title, description });
    }

    return Response.json({ success: true });
       
  } catch (error) {
    return Response.json({ error: "Failed to update Care Hero" }, { status: 500 });
  }
}
