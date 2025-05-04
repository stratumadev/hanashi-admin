export interface User {
    createdAt?: Date
    updatedAt?: Date
    id: string
    email: string
    username: string
    displayname: string
    password: string
    twoFactorSecret?: string
    rank: string
}
