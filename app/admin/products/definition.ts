type ProductProps = {
    product_id: number,
    category_id: number | null,
    product_img: string,
    product_name: string,
    product_price: number, 
    product_description: string,
    stock: number,
}

type CategoryProps = {
    category_id: number,
    category_name: "Formal Upright" | "Informal Upright" | "Slanting" | "Cascade" | "Semi-Cascade",
    size: "Keshitsubo" | "Shito" | "Mame" | "Shohin" | "Kumono" | "Katade-mochi" | "Chiu",
    age: "Young" | "Mature" | "Aged",
    price: number,
    care_level: "Beginner" | "Intermediate" |"Advanced", 
}

export const bonsaiProducts: ProductProps[] = [
    {
        product_id: 1,
        category_id: 1,
        product_name: "Japanese Maple",
        product_img: "/img/bonsai-3.jpg",
        product_price: 15000,
        product_description: "Lorem Ipsum",
        stock: 5
    },
    {
        product_id: 2,
        category_id: 2,
        product_name: "Sakura Tree",
        product_img: "/img/bonsai-2.jpg",
        product_price: 15000,
        product_description: "Lorem Ipsum",
        stock: 5
    },
    {
        product_id: 3,
        category_id: 3,
        product_name: "Japanese Yen",
        product_img: "/img/bonsai-1.jpg",
        product_price: 15000,
        product_description: "Lorem Ipsum",
        stock: 5
    },
    {
        product_id: 4,
        category_id: 4,
        product_name: "Bamboo",
        product_img: "/img/bonsai-5.jpg",
        product_price: 15000,
        product_description: "Lorem Ipsum",
        stock: 5
    },
    {
        product_id: 5,
        category_id: 5,
        product_name: "Bamboo",
        product_img: "/img/bonsai-4.jpg",
        product_price: 15000,
        product_description: "Lorem Ipsum",
        stock: 5
    }
]

export const categories: CategoryProps[] = [
    {
        category_id: 1,
        category_name:  "Formal Upright",
        size: "Shito",
        age: "Young",
        price: 15000,
        care_level: "Advanced", 
    }
]