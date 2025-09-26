import { db } from "@/db/drizzle";
import { imageKit_productFiles, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params } : { params: Promise<{id: string}>}    
){
    const id  = Number((await params).id)

    try {
        const product = await db
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

        if(!product){
            return NextResponse.json({
                error: "Product not found"
            }, { status: 404 })
        }
        
        return NextResponse.json(product[0]);
    } catch (error) {
        console.error("Database error", error);
        throw new Error("Failed to fetch Product ID");
    }
}


export async function DELETE(
    req: NextRequest,
    { params } : { params: Promise<{id: string}> }
){
    const id = Number((await params).id);

    try {
        const deleted = await db
            .delete(products)
            .where(eq(products.product_id, id))
            .returning()

        if(!deleted){
            return NextResponse.json(
                { error: "Product not found or already delete" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Product delete successfully.",
            deleteProduct: deleted[0]
        })
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(
            { error: "Failed to delete product."},
            { status: 500 }
        )
    }
}