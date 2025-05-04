<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="flex flex-col gap-2 text-black text-sm font-bold">
            <input v-model="username" type="text" placeholder="Username" class="py-3 px-3 rounded-xl focus:outline-none bg-white" />
            <input v-model="displayname" type="text" placeholder="Displayname" class="py-3 px-3 rounded-xl focus:outline-none bg-white" />
            <input v-model="password" type="password" placeholder="Password" class="py-3 px-3 rounded-xl focus:outline-none bg-white" />
            <altcha-widget
                id="altcha"
                style="--altcha-max-width: 100%; --altcha-color-text: white; --altcha-border-radius: 10px"
                :challengeurl="`${config.public.origin}/api/captcha/`"
                hidefooter
            ></altcha-widget>
            <button
                @click="login"
                class="bg-white disabled:bg-[#a3a3a3] py-3 px-3 rounded-xl mt-2 hover:bg-[#ffffffad] transition-all duration-300 flex flex-row items-center justify-center gap-1"
                :disabled="!token"
            >
                Register
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Session } from '~/components/types/token'
const config = useRuntimeConfig()

const username = ref<string>()
const displayname = ref<string>()
const password = ref<string>()
const token = ref<string>()

const session = useCookie<Session | undefined>('auth', {
    default: () => undefined,
    maxAge: 2628000
})

async function login() {
    const { data, error } = await useAPI<Session>(`/api/user/register`, {
        method: 'POST',
        body: {
            username: username.value,
            displayname: displayname.value,
            password: password.value,
            token: token.value
        }
    })
    if (error.value) {
        console.log(error.value)
        return
    }

    session.value = data.value

    navigateTo('/')
}

interface AltchaStateChangeEvent extends Event {
    detail: {
        state: 'unverified' | 'verifying' | 'verified' | 'error'
        payload?: string
    }
}

onMounted(() => {
    const altchaElement = document.querySelector('#altcha') as HTMLElement
    if (altchaElement) {
        altchaElement.addEventListener('statechange', (ev) => {
            const customEvent = ev as AltchaStateChangeEvent
            console.log('state:', customEvent.detail.state)
            if (customEvent.detail.state === 'verified') {
                token.value = customEvent.detail.payload
                console.log('payload:', customEvent.detail.payload)
            }
        })
    }
})
</script>

<style></style>
