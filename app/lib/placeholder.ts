import { string } from "zod"


export const ReviewsData : {
    title: string,
    description: string,
    author: string,
    date: string,
    stars: number
}[] = [
    {
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        author: 'Jontillano, L.',
        date: '08/09/2025',
        stars: 4
    },
    {
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        author: 'Panoringan, M.',
        date: '08/09/2025',
        stars: 5
    }, 
    {
        title: 'Ginseng Ficus',
        description: 'Lorem Ipsum dolor sit amet, consectetur',
        author: 'Madonan, C.',
        date: '08/09/2025',
        stars: 4
    }
]