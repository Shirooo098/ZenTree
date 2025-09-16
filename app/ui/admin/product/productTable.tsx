import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import TableUI from "@/components/ui/table-ui";
import { Building2, MapPin, Users } from "lucide-react";
import Image from 'next/image';

export interface ProductProps {
    product_id: number,
    category_id: number | null,
    product_img: string,
    product_name: string,
    product_price: number, 
    product_description: string,
    stock: number,
}



const ProductsTable = ({
    bonsaiProductsData
}: {
    bonsaiProductsData: ProductProps[]
}) => {

    const tableHeads = [
        "Product ID", 
        "Category_id", 
        "Image", 
        "Name", 
        "Description", 
        "Price", 
        "Stock",
        "Action"
    ];
    const displayTableRow = (bonsai: ProductProps, index: number) => (
        <TableRow key={bonsai.product_id} className="h-[100px]">
            <TableCell className="font-medium">
                <span>{bonsai.product_id}</span>
            </TableCell>
            <TableCell className="font-medium">
                <span>{bonsai.category_id}</span>
            </TableCell>
            <TableCell className="p-4">
                <div className="relative size-[80px] flex items-center gap-2">
                    <Image 
                        src={bonsai.product_img}
                        alt={bonsai.product_name}
                        fill
                        className="object-contain size-full"
                    />
                
                </div>
            </TableCell>
            <TableCell className="p-4 w-[20px]">
                {bonsai.product_name}
            </TableCell>
            <TableCell className="p-4 max-w-[50px]">
                <span className="truncate block">{bonsai.product_description}</span>
            </TableCell>
            <TableCell>
                <span>
                    {`₱${bonsai.product_price}`}
                </span>
            </TableCell>
            <TableCell className="p-4">
                <div className="flex">
                    {bonsai.stock}
                </div>
            </TableCell>
            <TableCell className="p-4">
                <div className="flex gap-2">
                    <Button>
                        View
                    </Button>
                    <Button>Edit</Button>
                </div>
            </TableCell>
        </TableRow>
    );

  return (
    <div className="w-full">
      <div className="border rounded-lg hidden lg:block">
        <TableUI 
          items={bonsaiProductsData} 
          tableHeads={tableHeads} 
          tableRow={displayTableRow} 
        /> 
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:hidden">
        {bonsaiProductsData.map((bonsai) => (
          <div key={bonsai.product_id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                
                    <div className="w-full flex items-start gap-2">
                        <h3>Product ID:</h3>
                        <span>{bonsai.product_id}</span>
                    </div>


                    <div className="w-full flex items-start gap-2">
                        <h3>Category ID:</h3>
                        <span>{bonsai.category_id}</span>
                    </div>

            </div>
          

            <div className="relative flex items-center gap-2 mb-3">
                <Image 
                    src={bonsai.product_img}
                    alt={bonsai.product_name}
                    fill
                    className="object-contain"
                />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{bonsai.product_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{bonsai.product_price}</span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Stock</p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{bonsai.stock}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-3 border-t">
              <Button variant="outline" className="flex-1 rounded-sm">View</Button>
              <Button variant="outline" className="flex-1 rounded-sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTable;