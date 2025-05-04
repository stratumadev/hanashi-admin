export interface Invite {
    createdAt?: Date
    updatedAt?: Date
    id: string
    code: string
    used: boolean
}

export interface InviteCreate {
    code: string
    used: boolean
}
