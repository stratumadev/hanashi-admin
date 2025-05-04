<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/create`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/masslinker`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon name="game-icons:fleshy-mass" class="h-4 w-4" />
                Masslinker
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"></div>
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Episode </div>
            </div>
            <div v-if="episodes && !isFetching" class="flex flex-col gap-3">
                <div
                    v-for="(episode, i) in episodes"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                >
                    <div class="flex-1 flex flex-row items-center justify-center h-full gap-2">
                        <button
                            v-if="episodes[i - 1]"
                            @click="switchEpisode(episode.id, episodes[i - 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowup" class="h-4 w-4" />
                        </button>
                        <button
                            v-if="episodes[i + 1]"
                            @click="switchEpisode(episode.id, episodes[i + 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowdown" class="h-4 w-4" />
                        </button>
                    </div>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/${episode.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ episode.name ? episode.name[0].name : 'NONAME' }}
                    </NuxtLink>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/${episode.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ episode.episode_number }}
                    </NuxtLink>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/${episode.id}`" class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </NuxtLink>
                </div>
            </div>
            <div v-if="!episodes && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Episode } from '~/components/types/episodes'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()
const route = useRoute()

const isFetching = ref<boolean>(false)
const episodes = ref<Episode[]>()
const isLoading = ref(false)

const fetchEpisodes = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Episode[]>(`/api/episode/admin/season/${route.params.season}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    episodes.value = data.value
    isFetching.value = false
}

const switchEpisode = async (id: string, id_switch: string) => {
    const { error } = await useAPI<{
        id: string
    }>(`/api/episode/admin/switch`, {
        method: 'POST',
        body: {
            up: id,
            down: id_switch
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    await fetchEpisodes()
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchEpisodes()
}
</script>

<style></style>
