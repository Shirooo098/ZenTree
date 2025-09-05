import BonsaiCard from "@/app/components/cards/bonsai-card";
import { bonsaiProducts } from "@/app/types/placeholder";

export default function BonsaiProduct(){
    return(
        <>
            {bonsaiProducts.map((bons) => {
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