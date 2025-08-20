import { string } from "zod"


export const ReviewsData : {
    id: number,
    title: string,
    description: string,
    profile: string,
    author: string,
    date: string,
    stars: number
}[] = [
    {
        id: 1,
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        profile: '',
        author: 'Jontillano, L.',
        date: '08/09/2025',
        stars: 4
    },
    {
        id: 2,
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        profile: '',
        author: 'Panoringan, M.',
        date: '08/09/2025',
        stars: 5
    }, 
    {
        id: 3,
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        profile: '',
        author: 'Madonan, C.',
        date: '08/09/2025',
        stars: 4
    }
]