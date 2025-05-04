import type { Category } from './categories'

export interface Item {
    createdAt?: Date
    updatedAt?: Date
    id: string
    active: boolean
    type: 'series' | 'ova' | 'ona' | 'movie'
    scene: 'anime' | 'hentai'
    name: {
        locale: string
        name: string
    }[]
    alternative_names: string[]
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
    metadata: {
        release_date?: string
    }
    references?: {
        service: string
        id: string
        url?: string
    }[]
    categories: Category[]
}

export interface ItemCreate {
    type: 'series' | 'ova' | 'ona' | 'movie'
    scene: 'anime' | 'hentai'
    name: {
        locale: string
        name: string
    }[]
    alternative_names: string[]
    description?: {
        locale: string
        description: string
    }[]
    metadata: {
        release_date?: string
    }
    references?: {
        service: string
        id: string
        offset?: number
        url?: string
    }[]
}
