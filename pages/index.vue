<template>
    <div class="relative flex flex-col items-center justify-center gap-3 ml-72 p-5 min-h-screen font-pjs font-bold"> NO ACCESS </div>
</template>

<script lang="ts" setup>
import type { Session } from '~/components/types/token'

definePageMeta({
    layout: 'admin'
})

const session = useCookie<Session | undefined>('auth', {
    default: () => undefined,
    maxAge: 2628000
})

if (!session.value || session.value.type === 'access_token') {
    navigateTo('/login')
} else {
    navigateTo('/animes')
}
</script>
