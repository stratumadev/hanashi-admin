export interface Category {
    createdAt?: Date
    updatedAt?: Date
    id: string
    type: 'main-genre' | 'secondary-genre' | 'tag'
    scene: 'anime' | 'hentai'
    name: {
        locale: string
        name: string
    }[]
    description?: {
        locale: string
        description: string
    }[]
    images?: {
        banner?: {
            width: number
            height: number
            format: 'avif' | 'webp' | 'png'
            source: string
        }[]
        cover?: {
            width: number
            height: number
            format: 'avif' | 'webp' | 'png'
            source: string
        }[]
    }
    references?: {
        service: string
        name: string
        url?: string
    }[]
}

export interface CategoryCreate {
    type: 'main-genre' | 'secondary-genre' | 'tag'
    scene: 'anime' | 'hentai'
    name: {
        locale: string
        name: string
    }[]
    description?: {
        locale: string
        description: string
    }[]
    references?: {
        service: string
        name: string
        url?: string
    }[]
}
