'use server';

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const EditAddressSchema = z.object({
  address_id: z.string(),
  address: z.string().min(5),
  city: z.string(),
  province: z.string(),
  postal_code: z.string().optional(),
  special_instructions: z.string().optional(),
});

export async function updateAddress(formData: FormData) {
  const validated = EditAddressSchema.parse({
    address_id: formData.get("address_id"),
    address: formData.get("address"),
    city: formData.get("city"),
    province: formData.get("province"),
    postal_code: formData.get("postal_code"),
    special_instructions: formData.get("special_instructions"),
  });

  await db.update(schema.address)
    .set({
      address: validated.address,
      city: validated.city,
      province: validated.province,
      postal_code: validated.postal_code,
      special_instructions: validated.special_instructions,
    })
    .where(eq(schema.address.address_id, Number(validated.address_id)));

  return { message: "Address updated successfully" };
}
