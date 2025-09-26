import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import {  ChartLine  } from "lucide-react";
import { Image, ImageKitProvider } from '@imagekit/next';
import { EditProductDialog } from "./dialog/EditDialog";
import { AlertDeleteProductDialog } from "./dialog/AlertDeleteDialog";
import { ProductProps } from "@/app/types/definition";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react"

const ProductsTable = ({
    bonsaiProductsData
}: {
    bonsaiProductsData: ProductProps[]
}) => {

    const tableHeads = [
        "Product ID", 
        "Category", 
        "Image", 
        "Name", 
        "Size",
        "Age",
        "Bonsai Care Level",
        "Description", 
        "Price", 
        "Stock",
        "Action"
    ];
    const displayTableRow = (bonsai: ProductProps) => (
        <TableRow key={bonsai.id} className="h-[100px]">
            <TableCell className="font-medium">
                <span>{bonsai.id}</span>
            </TableCell>
            <TableCell className="font-medium">
                <span>{bonsai.bonsaiCategory}</span>
            </TableCell>
            <TableCell className="flex justify-center p-4">
                <div className="relative size-[80px] flex justify-center items-center gap-2">
                  <ImageKitProvider urlEndpoint={bonsai.image_url}>
                    <Image 
                          src={bonsai.image_url}
                          alt={bonsai.name}
                          fill
                          className="object-contain"
                      />
                  </ImageKitProvider>
                </div>
            </TableCell>
            <TableCell className="p-4 w-[20px]">
                {bonsai.name}
            </TableCell>
            <TableCell className="p-4 w-[20px]">
                {bonsai.size}
            </TableCell>
            <TableCell className="p-4 w-[20px]">
                {bonsai.bonsaiAge}
            </TableCell>
            <TableCell className="p-4 w-[20px]">
                {bonsai.bonsaiCareLevel}
            </TableCell>
            <TableCell className="p-4 max-w-[50px]">
                <span className="text-left truncate block">{bonsai.description}</span>
            </TableCell>
            <TableCell>
                <span>
                    {`₱${bonsai.price}`}
                </span>
            </TableCell>
            <TableCell className="p-4">
                    {bonsai.stock}
            </TableCell>
            <TableCell className="p-4">
                <div className="flex justify-center items-center gap-2">
                  <Link href={`/admin/products/edit-product/${bonsai.id}`}>
                    <Button variant='outline' className="flex-1 cursor-pointer">
                      <Pen />Edit
                    </Button>
                  </Link>
                  <AlertDeleteProductDialog />
                </div>
            </TableCell>
        </TableRow>
    );

  return (
    <div className="w-full mt-6">
      <div className="border rounded-lg hidden lg:block">
        <TableUI 
          items={bonsaiProductsData} 
          tableHeads={tableHeads} 
          tableRow={displayTableRow} 
        /> 
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
        {bonsaiProductsData.map((bonsai) => (
          <div key={bonsai.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="">
              <div className="w-1/2 flex flex-col items-start">
                <p className="font-medium">{bonsai.name}</p>
              </div>
              <div className="w-1/2 flex items-start">
                  <p className="text-sm text-muted-foreground">Product ID: {bonsai.id}</p>
              </div>
            </div>

            <div className="relative h-48 flex flex-col items-center my-3">
                <ImageKitProvider urlEndpoint={bonsai.image_url}>
                  <Image 
                        src={bonsai.image_url}
                        alt={bonsai.name}
                        fill
                        className="object-contain"
                    />
                </ImageKitProvider>
            </div>
 
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="w-1/2 flex flex-col items-start">
                <p className="text-xs text-muted-foreground">Category</p>
                <span>{bonsai.category}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Size</p>
                <p className="font-medium">{bonsai.size}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-medium">{bonsai.bonsaiAge}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Care Level</p>
                <p className="font-medium">{bonsai.bonsaiCareLevel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{bonsai.price}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stock</p>
                <div className="flex items-center gap-2">
                  <ChartLine  className="h-4 w-4 text-s" />
                  <span>{bonsai.stock}</span>
                </div>
              </div>
            </div>
            
           <div className="flex gap-2">
                  <Link href={`/admin/products/edit-product/${bonsai.id}`}>
                    <Button variant='outline' className="flex-1 cursor-pointer">
                      <Pen />Edit
                    </Button>
                  </Link>
                  <AlertDeleteProductDialog />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTable;