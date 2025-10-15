"use client";

import { useState, Suspense } from "react";
import ProductsTable from "@/app/ui/admin/product/productTable";
import Button from "@/app/ui/button";
import { Plus, Search } from "lucide-react";
import { DMSans, ManRope } from "@/app/ui/fonts";
import { useAllProducts } from "@/app/lib/query/product-data";
import { InvoicesTableSkeleton } from "@/components/ui/skeleton/skeleton";

export default function Products() {
  const { data, isLoading, isError } = useAllProducts("/api/admin");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  if (isLoading) return <InvoicesTableSkeleton />;
  if (isError) console.log("Error", isError);

  
  const filteredProducts = (data ?? [])
    .filter((product) =>
      filter === "all" ? true : product.category === filter
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={`${ManRope.className}`}>
      
      <div className="flex justify-between flex-wrap gap-4">
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
            <Button
              variant="primary"
              size="md"
              className="capitalize flex px-4 py-2 justify-center items-center gap-2 text-sm"
            >
              <Plus /> Add product
            </Button>
          </a>
        </div>
      </div>

      
      <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
      
        <div className="relative w-full sm:w-1/2 md:w-1/3">
          <input
            type="text"
            placeholder="Search bonsai product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        
            <select
                aria-label="Filter bonsai by style"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black-600"
                >
                <option value="all">All Bonsai Styles</option>
               
            </select>

      </div>

      
      <div className="mt-6">
        <Suspense fallback={<InvoicesTableSkeleton />}>
          <ProductsTable bonsaiProductsData={filteredProducts} />
        </Suspense>
      </div>
    </div>
  );
}
