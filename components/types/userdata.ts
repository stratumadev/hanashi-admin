export interface Userdata {
    username: string
    displayname: string
    email: string
    user_rank: {
        name: string
        default: boolean
        moderator: boolean
        admin: boolean
        dev: boolean
    }
}
