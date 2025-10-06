'use server';

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserAddresses(userId: string) {
  const results = await db
    .select()
    .from(schema.address)
    .where(eq(schema.address.user_id, userId));

  
  return results.map((addr) => ({
    ...addr,
    postal_code: addr.postal_code ?? undefined,
    special_instructions: addr.special_instructions ?? undefined,
  }));
}
