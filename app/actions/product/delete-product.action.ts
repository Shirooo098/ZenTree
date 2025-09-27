// app/lib/actions/deleteProduct.ts
"use server"

import { db } from "@/db/drizzle"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: number) {
  await db.delete(products).where(eq(products.product_id, productId))
  revalidatePath("/admin/products")
}
