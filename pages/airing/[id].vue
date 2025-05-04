<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink :to="`/calendar`" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <NuxtLink
                v-if="airing"
                :to="`/anime/${airing.item}/seasons/${airing.season}/episodes/masslinker`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" name="game-icons:fleshy-mass" class="h-4 w-4" />
                Masslinker
            </NuxtLink>
            <button
                @click="deleteAiring()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="updateAiring()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div v-if="airing" class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Anime</div>
                <div class="flex flex-col gap-2">
                    <div class="text-sm">
                        {{
                            airing.airing_item
                                ? airing.airing_item.name.find((n) => n.locale === 'de-DE')
                                    ? airing.airing_item.name.find((n) => n.locale === 'de-DE')?.name
                                    : airing.airing_item.name[0].name
                                : 'Nicht ausgewählt'
                        }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Staffel</div>
                <div class="text-sm">
                    S{{ airing.airing_season && airing.airing_season.season_number ? airing.airing_season.season_number : 0 }}
                    -
                    {{
                        airing.airing_season && airing.airing_season.name
                            ? airing.airing_season.name.find((n) => n.locale === 'de-DE')
                                ? airing.airing_season.name.find((n) => n.locale === 'de-DE')?.name
                                : airing.airing_season.name[0].name
                            : 0
                    }}
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Folge</div>
                {{ airing.episode_number }}
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Release</div>
                <input
                    type="datetime-local"
                    v-model="date"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="Erste Folge"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Typ</div>
                <select v-model="airing.type" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="sub">Sub</option>
                    <option value="dub">Dub</option>
                </select>
            </div>
            <div v-if="episodes" class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Episode</div>
                <select v-model="airing.episode" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option v-for="ep in episodes" :value="ep.id">Episode {{ ep.episode_number }}</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Airing } from '~/components/types/airings'
import type { Episode } from '~/components/types/episodes'
import type { Item } from '~/components/types/items'
import type { Season } from '~/components/types/seasons'
import type { Userdata } from '~/components/types/userdata'
import { useToast } from '@/plugins/useToast'
const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const isLoading = ref(false)

const route = useRoute()

const config = useRuntimeConfig()

const item = ref<Item>()
const season = ref<Season>()
const airing = ref<Airing>()
const date = ref<Date>()

const episodes = ref<Episode[]>()
const selectedEpisode = ref<Episode>()

const isFetching = ref<boolean>(false)

const updateAiring = async () => {
    isLoading.value = true

    if (!airing.value || !date.value) return

    const { data, error } = await useAPI(`/api/airing/`, {
        method: 'PUT',
        body: {
            id: airing.value.id,
            episode: airing.value.episode,
            release_date: new Date(date.value).toISOString(),
            type: airing.value.type
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        addToast({
            title: 'Fehler',
            description: 'Konnte nicht gespeichert werden!',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }

    addToast({
        title: 'Gespeichert',
        description: 'Airing gespeichert!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    fetchAiring()

    episodes.value = undefined
}

const fetchAiring = async () => {
    const { data, error } = await useAPI<Airing>(`/api/airing/admin/${route.params.id}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    if (data.value.release_date) {
        const r = new Date(data.value.release_date)

        const year = r.getFullYear()
        const month = String(r.getMonth() + 1).padStart(2, '0')
        const day = String(r.getDate()).padStart(2, '0')
        const hours = String(r.getHours()).padStart(2, '0')
        const minutes = String(r.getMinutes()).padStart(2, '0')

        date.value = `${year}-${month}-${day}T${hours}:${minutes}` as any
    }

    if (!data.value.episode) {
        await fetchEpisodes(data.value.season)
    }

    airing.value = data.value
}

const fetchEpisodes = async (season: string) => {
    const { data, error } = await useAPI<Episode[]>(`/api/episode/admin/season/${season}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    episodes.value = data.value
}

const deleteAiring = async () => {
    isLoading.value = true

    if (!airing.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/airing/${airing.value.id}`, {
        method: 'DELETE'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false

        addToast({
            title: 'Fehler',
            description: 'Konnte nicht gelöscht werden!',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }

    addToast({
        title: 'Gelöscht',
        description: 'Airing gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo(`/calendar`)
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchAiring()
}
</script>

<style></style>
