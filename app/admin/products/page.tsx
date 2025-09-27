"use client";

import ProductsTable from "@/app/ui/admin/product/productTable";
import Button from "@/app/ui/button";
import { Plus } from 'lucide-react';
import { DMSans, ManRope } from "@/app/ui/fonts";
import { useAllProducts } from "@/app/lib/query/product-data";
import { InvoicesTableSkeleton } from "@/components/ui/skeleton/skeleton";
import { Suspense } from "react";

export default function Products(){
    const { data, isLoading, isError, } = useAllProducts("/api/admin");

    if(isLoading) return <InvoicesTableSkeleton/>
    if(isError) console.log("Error", isError);

    return(
        <div className={`${ManRope.className}`}>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h3 className={`${DMSans.className} text-3xl text-dark-brown`}>
                        Products
                    </h3>
                    <span className="mt-2 text-muted-foreground">
                        A list of products where you can create, edit, and delete products.
                    </span>
                </div>
                <div className="flex items-center">
                    <a href="/admin/products/add-product">
                        <Button variant="primary" size="md" 
                            className="capitalize flex px-4 py-2 justify-center items-center gap-2 text-sm">
                        <Plus/> 
                        Add product
                    </Button>
                    </a>
                </div>
            </div>


            <Suspense fallback={<InvoicesTableSkeleton/>}>
                <ProductsTable bonsaiProductsData={data ?? []}/>
            </Suspense>

        </div>
    )
}