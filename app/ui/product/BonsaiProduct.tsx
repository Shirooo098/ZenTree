import BonsaiCard from "@/app/components/cards/bonsai-card";
import { ProductProps } from "@/app/types/definition";
import Link from "next/link";

type BonsaiProductProps = {
    productsData: ProductProps[]
}

export default function BonsaiProduct({productsData}: BonsaiProductProps){
    return(
        <>
            {productsData.map((prod) => {
                return(
                   <Link key={prod.id} href={`/product/${prod.id}`}>
                    <BonsaiCard 
                        key={prod.id}
                        id={prod.id}
                        name={prod.name}
                        care={prod.bonsaiCareLevel}
                        style={prod.bonsaiCategory}
                        price={prod.price}
                        age={prod.bonsaiAge}
                        imageUrl={prod.image_url}
                    />
                    </Link>
                )
            })}
        </>
    )
}