'use server';

import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { AddressState } from "@/app/types/address";
import { AddAddressFormSchema } from "@/app/types/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function addAddress(
  prevState: AddressState,
  formData: FormData
): Promise<AddressState> {
  const validated = AddAddressFormSchema.safeParse({
    user_id: formData.get("user_id")?.toString(),
    address: formData.get("address")?.toString(),
    city: formData.get("city")?.toString(),
    province: formData.get("province")?.toString(),
    postal_code: formData.get("postal_code")?.toString(),
    special_instructions: formData.get("special_instructions")?.toString(),
  });

  if (!validated.success) {
    const { fieldErrors } = validated.error.flatten();
    return { message: "Validation failed", errors: fieldErrors };
  }

  try {
    await db.insert(schema.address).values(validated.data);

    revalidatePath("/profile")
    redirect("/profile")
  } catch (err) {
    console.error(err);
    return { message: "Failed to add address" };
  }
}
