"use server";

import { createAuditLog, getRequestMetadata, requireAdminOrStaff } from "@/app/lib/audit-server.action";
import { productSchema } from "@/app/types/schema";
import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function editProductAction(formData: FormData) {
    try {
        // 1. Check permissions (this replaces all the auth checking code)
        const { authorized, session, error } = await requireAdminOrStaff();
        if (!authorized) return error;

        // 2. Extract and validate form data
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

        const productId = Number(formData.get("productId"));

        if (!productId || isNaN(productId)) {
            return {
                message: "Invalid product ID",
                errors: {}
            };
        }

        const validateFields = productSchema.safeParse(data);

        if (!validateFields.success) {
            const { fieldErrors } = validateFields.error.flatten();
            return {
                message: "Validation Error",
                errors: fieldErrors
            };
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

        // 3. Get existing product for audit log
        const [oldProduct] = await db
            .select()
            .from(products)
            .where(eq(products.product_id, productId))
            .limit(1);

        if (!oldProduct) {
            return {
                message: "Product not found",
                errors: {}
            };
        }

        // 4. Update the product
        const [updatedProduct] = await db
            .update(products)
            .set({
                product_name: productName,
                product_category: productCategory,
                bonsai_size: size,
                bonsai_category: bonsaiCategory,
                bonsai_age: bonsaiAge,
                bonsai_care_level: bonsaiCareLevel,
                product_price: productPrice,
                product_desc: productDescription,
                stock: stock,
                updated_by: session!.id,
                updated_at: new Date(),
            })
            .where(eq(products.product_id, productId))
            .returning();

        // 5. Create audit log (one clean call)
        const { ipAddress, userAgent } = await getRequestMetadata();
        await createAuditLog({
            userId: session!.id,
            action: 'update',
            tableName: 'products',
            recordId: productId,
            oldValues: {
                product_name: oldProduct.product_name,
                product_category: oldProduct.product_category,
                product_price: oldProduct.product_price,
                stock: oldProduct.stock,
            },
            newValues: {
                product_name: updatedProduct.product_name,
                product_category: updatedProduct.product_category,
                product_price: updatedProduct.product_price,
                stock: updatedProduct.stock,
            },
            ipAddress,
            userAgent,
        });

        return {
            message: "Product Updated Successfully.",
            errors: {}
        };

    } catch (error) {
        console.error("Error editing product", error);
        return {
            message: 'Database Error: Failed to edit product.',
            errors: {}
        };
    }
}