"use server";

import { productSchema } from "@/app/types/schema";
import { db } from "@/db/drizzle";
import { imageKit_productFiles, products } from "@/db/schema";
import z from "zod";

export async function createProductAction(formData: FormData){
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

        const imageRecordId = formData.get("imageRecordId") as string

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
            productName,
            size,
            bonsaiCategory,
            bonsaiAge,
            bonsaiCareLevel,
            productPrice,
            stock,
            productDescription,
        } = validateFields.data;


            await db.insert(products).values({
                product_category: productCategory,
                product_name: productName,
                bonsai_size: size,
                bonsai_category: bonsaiCategory,
                bonsai_age: bonsaiAge,
                bonsai_care_level: bonsaiCareLevel,
                product_price: productPrice,
                product_desc: productDescription,
                imageKit_productFiles_id: parseInt(imageRecordId),
                stock: stock
            });

            return{
                message: "Product Created Successfully."
            }
    } catch (error) {
        console.error("Error uploading product", error);
        return{
            message: 'Database Error: Failed to upload product.'
        }
    }
}