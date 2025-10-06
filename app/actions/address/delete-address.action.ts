'use server';

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function deleteAddress(addressId: number) {
  await db.delete(schema.address)
    .where(eq(schema.address.address_id, addressId));
  return { message: "Address deleted successfully" };
}
