import BonsaiCard from "@/app/components/cards/bonsai-card";
import { BonsaiProps } from "@/app/types/definition";

type BonsaiProductProps = {
  products: BonsaiProps[];
};

export default function BonsaiProduct({products}: BonsaiProductProps){
    return(
        <>
            {products.map((bons) => {
                return(
                    <BonsaiCard 
                        key={bons.id}
                        id={bons.id}
                        name={bons.name}
                        care={bons.care}
                        style={bons.style}
                        price={bons.price}
                        age={bons.age}
                        image={bons.image}
                    />
                )
            })}
        </>
    )
}