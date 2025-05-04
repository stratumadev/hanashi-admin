export interface Session {
    createdAt: Date
    type: 'access_token' | 'granted_access_token'
    access_token: string
    refresh_token: string
    expires_in: number
}
