import { ProductProps } from "@/app/ui/admin/product/productTable"

export const bonsaiProductsProps: ProductProps[] = [
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
        product_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        stock: 5
    },
    {
        product_id: 5,
        category_id: 5,
        product_name: "Bamboo",
        product_img: "/img/bonsai-4.jpg",
        product_price: 15000,
        product_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        stock: 5
    }
]

type CategoryProps = {
    category_id: number,
    category_name: "Formal Upright" | "Informal Upright" | "Slanting" | "Cascade" | "Semi-Cascade",
    size: "Keshitsubo" | "Shito" | "Mame" | "Shohin" | "Kumono" | "Katade-mochi" | "Chiu",
    age: "Young" | "Mature" | "Aged",
    care_level: "Beginner" | "Intermediate" |"Advanced", 
}

export const categories: CategoryProps[] = [
    {
        category_id: 1,
        category_name:  "Formal Upright",
        size: "Shito",
        age: "Young",
        care_level: "Advanced", 
    },
    {
        category_id: 2,
        category_name:  "Informal Upright",
        size: "Mame",
        age: "Young",
        care_level: "Beginner", 
    },
    {
        category_id: 3,
        category_name:  "Slanting",
        size: "Kumono",
        age: "Aged",
        care_level: "Intermediate", 
    },
    {
        category_id: 4,
        category_name:  "Cascade",
        size: "Chiu",
        age: "Young",
        care_level: "Advanced", 
    },
    {
        category_id: 5,
        category_name:  "Semi-Cascade",
        size: "Shito",
        age: "Mature",
        care_level: "Advanced", 
    }
]