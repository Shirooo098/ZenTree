"use client"

import ProductForm from "@/app/components/forms/product-form/ProductForm";
import { useProductId } from "@/app/lib/query/admin/product-data";
import React from "react";

export default function EditProduct({params}: {params: Promise<{ id: string }>}){
    const { id } = React.use(params); 
    const productId = Number(id);

    const {data: product, isLoading} = useProductId(productId);

    return(
        <div className="">
            <h3>Edit Product ID: {`${productId}`}</h3>
            <ProductForm 
                mode="edit"
                productId={productId}
                productData={product}
                isLoading={isLoading}
            />
        </div>
    )
}