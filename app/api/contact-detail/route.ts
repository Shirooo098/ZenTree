import { db } from "@/db/drizzle";
import { contact_detail } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(contact_detail).limit(1);
    return Response.json(data[0]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to fetch contact details" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { location, phone, email } = await req.json();
    const [existing] = await db.select().from(contact_detail).limit(1);

    if (existing) {
      await db
        .update(contact_detail)
        .set({ location, phone, email })
        .where(eq(contact_detail.id, existing.id));
    } else {
      await db.insert(contact_detail).values({ location, phone, email });
    }

    return Response.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return Response.json({ error: "Failed to update contact details" }, { status: 500 });
  }
}
