export interface Stream {
    episode: string
    item: string
    season: string
    type: string
    stream_hoster: {
        name: string
    }
    stream_episode: {
        episode_number: number
    }
    stream_season: {
        season_number: number
    }
    stream_item: {
        name: {
            name: string
            locale: string
        }[]
    }
    status: string
}
