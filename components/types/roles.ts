export interface Rank {
    createdAt: Date
    updatedAt: Date
    id: string
    name: string
    default: boolean
    tester: boolean
    moderator: boolean
    admin: boolean
    dev: boolean
}

export interface RankCreate {
    name: string
}
