'use server';

import { db } from "@/db/drizzle";
import { z } from "zod";
import { schema } from "@/db/schema";

export const AddAddressFormSchema = z.object({
  user_id: z.string(),
  address: z.string().min(5, "Street/Address must have at least 5 characters."),
  city: z.string().min(2, "City is required."),
  province: z.string().min(2, "Province is required."),
  postal_code: z.string().optional(),
  special_instructions: z.string().optional(),
});

export type AddressState = {
  errors?: Record<string, string[]>,
  message?: string | null,
};

export async function addAddress(
  prevState: AddressState,
  formData: FormData
): Promise<AddressState> {

  const validated = AddAddressFormSchema.safeParse({
    user_id: formData.get("user_id"),
    address: formData.get("address"),
    city: formData.get("city"),
    province: formData.get("province"),
    postal_code: formData.get("postal_code"),
    special_instructions: formData.get("special_instructions"),
  });

  if (!validated.success) {
    const { fieldErrors } = z.flattenError(validated.error);
    return { message: "Validation failed", errors: fieldErrors };
  }

  const data = validated.data;

  try {
    await db.insert(schema.address).values({
      user_id: data.user_id,
      address: data.address,
      city: data.city,
      province: data.province,
      postal_code: data.postal_code,
      special_instructions: data.special_instructions,
    });

    return { message: "Address added successfully!" };
  } catch (err) {
    console.error(err);
    return { message: "Failed to add address. Try again." };
  }
}
