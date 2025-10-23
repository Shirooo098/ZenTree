import { db } from "@/db/drizzle";
import { care_topics } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const topics = await db.select().from(care_topics).orderBy(care_topics.id);
    return Response.json(topics);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to fetch Care Topics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    const inserted = await db.insert(care_topics).values({ title, description});
    return Response.json({ success: true, topic: inserted });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to add Care Topic" }, { status: 500 });
  }
}

// PUT: update a topic
export async function PUT(req: Request) {
  const { id, title, description } = await req.json();
  await db.update(care_topics).set({ title, description }).where(eq(care_topics.id, id));
  return Response.json({ success: true });
}

// DELETE: remove a topic
export async function DELETE(req: Request) {
  const { id } = await req.json();
  await db.delete(care_topics).where(eq(care_topics.id, id));
  return Response.json({ success: true });
}

