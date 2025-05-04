import type { Episode } from './episodes'
import type { Item } from './items'
import type { Season } from './seasons'

export interface Airing {
    createdAt?: Date
    updatedAt?: Date
    id: string
    item: string
    season: string
    episode: string | undefined
    release_date: Date
    episode_number: number
    type: 'sub' | 'dub'
    locale: string
    airing_item: Item
    airing_season: Season
    airing_episode: Episode
}

export interface AiringCreate {
    item: string
    season: string
    episode: string | undefined
    release_date: Date
    episode_number: number | undefined
    type: 'sub' | 'dub'
    locale: string
}
