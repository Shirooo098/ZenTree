"use server";

import { productSchema } from "@/app/types/schema";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

export async function editProductAction(formData: FormData){
    try {
        const data = {
            productCategory: formData.get("productCategory"),
            productName: formData.get("productName"),
            size: formData.get("size"),
            bonsaiCategory: formData.get("bonsaiCategory"),
            bonsaiAge: formData.get("bonsaiAge"),
            bonsaiCareLevel: formData.get("bonsaiCareLevel"),
            productPrice: Number(formData.get("productPrice")),
            stock: Number(formData.get("stock")),
            productDescription: formData.get("productDescription"),
            imageProduct: formData.get("imageProduct") as File,
        };

        const productId = Number(formData.get("productId"))

        const validateFields = productSchema.safeParse(data);

        if (!validateFields.success) {
            const { fieldErrors } = z.flattenError(validateFields.error);
            console.log(fieldErrors)

            return {
                message: "Submission Error",
                errors: fieldErrors
            }
        }

        const {
            productCategory,
            size,
            bonsaiCategory,
            bonsaiAge,
            bonsaiCareLevel,
            productPrice,
            stock,
            productDescription,
        } = validateFields.data;

        console.log("Editting Data", validateFields.data)

            await db
            .update(products)
            .set({
                product_category: productCategory,
                bonsai_size: size,
                bonsai_category: bonsaiCategory,
                bonsai_age: bonsaiAge,
                bonsai_care_level: bonsaiCareLevel,
                product_price: productPrice,
                product_desc: productDescription,
                stock: stock,
                updated_at: new Date(),
            })
            .where(eq(products.product_id, productId));
            


            return{
                message: "Product Updated Successfully."
            }
    } catch (error) {
        console.error("Error editting product", error);
        return{
            message: 'Database Error: Failed to edit product.'
        }
    }
}