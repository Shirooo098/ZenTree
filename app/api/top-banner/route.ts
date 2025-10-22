import { db } from "@/db/drizzle";
import { top_banner } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(top_banner).limit(1);
    return Response.json(data[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { title, subtitle, description} = await req.json();
    const [existing] = await db.select().from(top_banner).limit(1);

    if (existing) {
      await db
        .update(top_banner)
        .set({ title, subtitle, description})
        .where(eq(top_banner.id, existing.id));
    } else {
      await db.insert(top_banner).values({ title, subtitle, description });
    }

    return Response.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to update banner" }, { status: 500 });
  }
}
