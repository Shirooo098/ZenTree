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
  name: string
  email: string
  avater?: string
  role?: string
}