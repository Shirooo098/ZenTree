"use server";

import { createAuditLog, getRequestMetadata, requireAdminOrStaff } from "@/app/lib/audit-server.action";
import { productSchema } from "@/app/types/schema";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import z from "zod";

export async function createProductAction(formData: FormData){
    try {

        const { authorized, session, error } = await requireAdminOrStaff();
        if (!authorized) return error;


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


             // 3. Insert product with created_by field
            const [newProduct] = await db.insert(products).values({
                product_category: productCategory,
                product_name: productName,
                bonsai_size: size,
                bonsai_category: bonsaiCategory,
                bonsai_age: bonsaiAge,
                bonsai_care_level: bonsaiCareLevel,
                product_price: productPrice,
                product_desc: productDescription,
                imageKit_productFiles_id: parseInt(imageRecordId),
                stock: stock,
                created_by: session!.id,  // Track who created it
                created_at: new Date(),
            }).returning();

            // 4. Create audit log
            const { ipAddress, userAgent } = await getRequestMetadata();
            await createAuditLog({
                userId: session!.id,
                action: 'create',
                tableName: 'products',
                recordId: newProduct.product_id,
                newValues: {
                    product_name: newProduct.product_name,
                    product_category: newProduct.product_category,
                    product_price: newProduct.product_price,
                    stock: newProduct.stock,
                },
                ipAddress,
                userAgent,
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