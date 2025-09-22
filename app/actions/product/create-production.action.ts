"use server";

import { db } from "@/db/drizzle";
import { imageKit_productFiles, products } from "@/db/schema";

interface ProductData {
    productName: string,
    productCategory: string,
    bonsaiSize?: string,
    bonsaiCategory?: string,
    bonsaiAge?: string;
    bonsaiCareLevel?: string,
    productPrice: number,
    stock: number,
    productDescription: string,
    fileId: string,
    fileUrl: string,
    userId: string
}


export async function createProduct(data: ProductData){
    console.log(data)

    try {
        const [imageRecord] = await db
            .insert(imageKit_productFiles)
            .values({
                product_image_id: data.fileId,
                product_image_url: data.fileUrl,
                user_id: data.userId
            })
            .returning({ id: imageKit_productFiles.id });

       await db.insert(products).values({
            product_name: data.productName,
            product_category: data.productCategory,
            bonsai_size: data.bonsaiSize,
            bonsai_category: data.bonsaiCategory,
            bonsai_age: data.bonsaiAge,
            bonsai_care_level: data.bonsaiCareLevel,
            product_price: data.productPrice,
            stock: data.stock,
            product_desc: data.productDescription,
            imageKit_productFiles_id: imageRecord.id
        });

        console.log(imageRecord)

        return{
            message: "Product Created Successfully."
        }
    } catch (error) {
        console.error(error)
        return {
            message: 'Database Error: Failed to create Product.'
        };
    }

}