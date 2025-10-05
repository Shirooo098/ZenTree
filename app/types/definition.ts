import { User, ShoppingCart  } from 'lucide-react';

export type ReviewCardProps = {
    id: number,
    title: string,
    description: string,
    author: string,
    profile: string,
    date: string,
    stars: number
}

export const centerSideLinks:NavLink[] = [
    { name: 'Product', href: '/product'},
    { name: 'Care Guide', href: '/care-guide'},
    { name: 'About', href: '/about'},
    { name: 'Contact', href: '/contact'},
    { name: 'FAQs', href: '/faqs'},
]

export const rightSideLinks:NavLink[] = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
]

export interface NavLink {
    name: string,
    href: string,
    icon?: React.ComponentType<any>
}

export interface User{
    id: string,
    name: string,
    username?: string | null,
    phoneNumber?: string | null | undefined,
    email: string,
    avater?: string | null,
    role?: string | null,
}

export type ProductFilters = {
    size: string,
    price: string,
    age: string,
    care: string,
    query: string,
}

export type BonsaiProps = {
    id: number;
    name: string;
    care: string;
    style: string;
    price: number;
    age: string;
    imageUrl: string;
};

export type EditProfileState = {
    errors?: {
        name?: string[],
        username?: string[],
        phoneNumber?: string[],
        image?: string[]
    };
    message?: string | null
}

export type ProductProps = {
    id: number,
    image_id: number,
    image_url: string,
    name: string,
    category: string,
    price: number,
    size: string,
    bonsaiCategory: string,
    bonsaiAge: string,
    bonsaiCareLevel: string,
    stock: number, 
    description: string,
}

export type CartItemProps = {
    cart_products_id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    product_name: string;
    product_price: number;
    product_category: string;
    product_desc: string;
    stock: number;
    bonsai_size: string | null;
    bonsai_category: string | null;
    bonsai_age: string | null;
    bonsai_care_level: string | null;
    product_image_url: string | null;
    product_image_id: string | null;
}

export interface CartProps {
    cart_id: number | null;
    items: CartItemProps[];
    totalItems: number;
    totalPrice: number;
}

export interface CartResponse {
    success: boolean;
    cart: CartProps;
    error?: string;
}

export interface OrderProduct {
    product_id: number;
    product_name: string;
    product_image_url: string
    quantity: number;
    price: number;
    subtotal?: number;
    price_at_purchase?: number;
}

export interface Order {
    order_id: number;
    user_id: string;
    order_status_name: string;
    created_at: string;
    updated_at?: string;
    tax?: number;
    discount?: number;
    shippingFee?: number;
    total: number;
    products: OrderProduct[]
}
