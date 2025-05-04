export interface Season {
    createdAt?: Date
    updatedAt?: Date
    id: string
    index: number
    item: string
    name: {
        locale: string
        name: string
    }[]
    season_number: number
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
        season_number?: number
        offset?: number
    }[]
}

export interface SeasonCreate {
    name: {
        locale: string
        name: string
    }[]
    season_number: number | undefined
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
        season_number?: number
        offset?: number
    }[]
}
