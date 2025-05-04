<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Index </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Hoster </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Type </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Status </div>
            </div>
            <div v-if="links && !isFetching" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="(invite, a) in links"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/anime/${invite.item}/seasons/${invite.season}/episodes/${invite.episode}`"
                >
                    <div class="text-sm flex-1 flex justify-center items-center text-center">
                        {{ invite.stream_item.name.find((n) => n.locale === 'de-DE')?.name }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center"> S{{ invite.stream_season.season_number }}E{{ invite.stream_episode.episode_number }} </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ invite.stream_hoster.name }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center uppercase" :class="invite.type === 'sub' ? 'text-red-300' : 'text-green-300'">
                        {{ invite.type }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ invite.status }}
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!links && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Invite } from '~/components/types/invites'
import type { Stream } from '~/components/types/streams'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const isFetching = ref<boolean>(false)
const links = ref<Stream[]>()

const fetchDeadLinks = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Stream[]>(`/api/stream/admin/dead`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    links.value = data.value.sort((a, b) => {
        const nameA = a.stream_item.name.find((n) => n.locale === 'de-DE')?.name || ''
        const nameB = b.stream_item.name.find((n) => n.locale === 'de-DE')?.name || ''

        if (nameA.localeCompare(nameB) !== 0) {
            return nameA.localeCompare(nameB)
        }

        if (a.stream_season.season_number !== b.stream_season.season_number) {
            return a.stream_season.season_number - b.stream_season.season_number
        }

        return a.stream_episode.episode_number - b.stream_episode.episode_number
    })
    isFetching.value = false
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchDeadLinks()
}
</script>

<style></style>
