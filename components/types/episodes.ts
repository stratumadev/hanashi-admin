export interface Episode {
    createdAt?: Date
    updatedAt?: Date
    id: string
    type: '3rdparty' | 'self'
    index: number
    item: string
    season: string
    name: {
        locale: string
        name: string
    }[]
    description: {
        locale: string
        description: string
    }[]
    episode_number?: number
    images?: {
        banner?: {
            width: number
            height: number
            format: 'avif' | 'webp' | 'png'
            source: string
        }[]
    }
    metadata: {
        release_date?: Date
    }
    references?: {
        service: string
        id: string
    }[]
    episode_streams?: {
        id?: string
        hoster: string | undefined
        item?: string
        season?: string
        episode?: string
        type: 'sub' | 'dub'
        locale?: string
        video_id: string | undefined
        status?: string
        stream_backupstream?: {
            status: string
        }
    }[]
}

export interface EpisodeCreate {
    type: '3rdparty' | 'self'
    item: string
    season: string
    name: {
        locale: string
        name: string
    }[]
    description: {
        locale: string
        description: string
    }[]
    episode_number: number
    images?: {
        banner?: {
            width: number
            height: number
            format: 'avif' | 'webp' | 'png'
            source: string
        }[]
    }
    metadata: {
        release_date?: Date
    }
    references: {
        service: string
        id: string
    }[]
}

export interface EpisodeMasslinker {
    id?: string
    type: '3rdparty' | 'self'
    index?: number
    item?: string
    season?: string
    name: {
        locale: string
        name: string
    }[]
    description: {
        locale: string
        description: string
    }[]
    episode_number?: number
    images?: {
        banner?: {
            width: number
            height: number
            format: 'avif' | 'webp' | 'png'
            source: string
        }[]
    }
    bannerBlob?: Blob
    bannerObject?: string
    metadata: {
        release_date?: Date
    }
    references?: {
        service: string
        id: string
    }[]
    episode_streams?: {
        id?: string
        hoster: string | undefined
        item?: string
        season?: string
        episode?: string
        type: 'sub' | 'dub'
        locale?: string
        video_id: string | undefined
    }[]
}
