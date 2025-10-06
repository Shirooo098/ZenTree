import { db } from "@/db/drizzle";
import { imageKit_productFiles, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";                              

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }   
){
    const id  = Number((await params).id)
    try {
        const productsData = await db
            .select({
                id: products.product_id,
                name: products.product_name,
                category: products.product_category,
                price: products.product_price,
                size: products.bonsai_size,
                bonsaiCategory: products.bonsai_category,
                bonsaiAge: products.bonsai_age,
                bonsaiCareLevel: products.bonsai_care_level,
                description: products.product_desc,
                stock: products.stock,
                image_url: imageKit_productFiles.product_image_url,
                image_id: imageKit_productFiles.id,
            })
            .from(products)
            .leftJoin(
                imageKit_productFiles,
                eq(products.imageKit_productFiles_id, imageKit_productFiles.id)
            )
            .where(eq(products.product_id, id));

            if(productsData.length === 0){
                return NextResponse.json({
                    error: "Product not found"
                }, { status: 404 })
            }

            return NextResponse.json({productsData})
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch products data.');
    }
}