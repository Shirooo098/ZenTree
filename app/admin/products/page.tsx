import ProductsTable from "@/app/ui/admin/product/productTable";
import { bonsaiProductsProps } from "./definition";

export default function Products(){
    return(
        <div>
            <h3>Products</h3>
            <ProductsTable bonsaiProductsData={bonsaiProductsProps}/>
        </div>
    )
}