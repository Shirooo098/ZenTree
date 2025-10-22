import { db } from "@/db/drizzle";
import { bonsai_content } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const content = await db.select().from(bonsai_content).limit(1);
    return Response.json(content[0]);
  } catch (error) {
    console.error("GET /bonsai-content failed:", error);
    return Response.json({ error: "Failed to fetch bonsai content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { bonsai1_title, bonsai1_description, bonsai2_title, bonsai2_description } = body;

    await db
      .update(bonsai_content)
      .set({ bonsai1_title, bonsai1_description, bonsai2_title, bonsai2_description })
      .where(eq(bonsai_content.id, 1));

    return Response.json({ message: "Bonsai content updated successfully!" });
  } catch (error) {
    console.error("PUT /bonsai-content failed:", error);
    return Response.json({ error: "Failed to update bonsai content" }, { status: 500 });
  }
}
