export interface Hoster {
    createdAt?: Date
    updatedAt?: Date
    id: string
    index: number
    name: string
    domains: {
        domain: string
        status: 'online' | 'offline'
    }[]
    embed_path: string
    image: string
}

export interface HosterCreate {
    name: string
    domains: string[]
    embed_path: string
}
