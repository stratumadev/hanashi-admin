import type { Session } from '~/components/types/token'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const session = useCookie<Session | undefined>('auth', {
        default: () => undefined,
        maxAge: 2628000
    })

    let refreshingPromise: Promise<Session | null> | null = null

    const sessionChannel = new BroadcastChannel('session_channel')

    sessionChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'SESSION_UPDATE') {
            session.value = event.data.session ? { ...event.data.session } : undefined
        }
    }

    async function fetchAccessToken(): Promise<Session | null> {
        const { data, error } = await useFetch<Session>(`${config.public.origin}/api/session/`, {
            method: 'POST',
            body: {
                refresh_token: session.value?.refresh_token
            }
        })

        session.value = undefined

        if (error.value) {
            console.log(error.value.data ? error.value.data.message : error.value.message)
            return await fetchAccessToken()
        }

        if (!data.value) return null

        session.value = data.value

        sessionChannel.postMessage({
            type: 'SESSION_UPDATE',
            session: JSON.parse(JSON.stringify(data.value))
        })

        return data.value
    }

    const getAccessToken = async () => {
        if (!session.value) {
            if (!refreshingPromise) {
                refreshingPromise = fetchAccessToken().finally(() => {
                    refreshingPromise = null
                })
            }
            const newSession = await refreshingPromise
            return newSession ? newSession.access_token : null
        }
        const now = new Date()
        const createdAt = new Date(session.value.createdAt)
        const expiresIn = (session.value.expires_in - 10) * 1000
        const expiryTime = createdAt.getTime() + expiresIn

        if (now.getTime() >= expiryTime) {
            if (!refreshingPromise) {
                refreshingPromise = fetchAccessToken().finally(() => {
                    refreshingPromise = null
                })
            }
            const newSession = await refreshingPromise
            return newSession ? newSession.access_token : null
        }

        return session.value.access_token
    }

    const api = $fetch.create({
        baseURL: config.public.origin,
        async onRequest({ request, options }) {
            const headers = ((options.headers as any) ||= {})
            if (Array.isArray(headers)) {
                headers.push(['Authorization', `Bearer ${await getAccessToken()}`])
            } else if (headers instanceof Headers) {
                headers.set('Authorization', `Bearer ${await getAccessToken()}`)
            } else {
                headers.Authorization = `Bearer ${await getAccessToken()}`
            }
        },
        async onResponseError({ response }) {
            // if (response.status === 403) {
            //     await navigateTo("/login");
            // }
        }
    })

    return {
        provide: {
            api
        }
    }
})
