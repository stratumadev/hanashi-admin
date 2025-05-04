<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                v-if="item && item.references && item.references.find((p) => p.service === 'crunchyroll')"
                @click="importCrunchy()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon v-if="!isLoading" name="mdi:import" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Importing' : 'Crunchy Import' }}
            </button>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/create`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"></div>
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Season </div>
            </div>
            <div v-if="seasons && !isFetching" class="flex flex-col gap-3">
                <div
                    v-for="(season, i) in seasons"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                >
                    <div class="flex-1 flex flex-row items-center justify-center h-full gap-2">
                        <button
                            v-if="seasons[i - 1]"
                            @click="switchSeasons(season.id, seasons[i - 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowup" class="h-4 w-4" />
                        </button>
                        <button
                            v-if="seasons[i + 1]"
                            @click="switchSeasons(season.id, seasons[i + 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowdown" class="h-4 w-4" />
                        </button>
                    </div>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${season.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ season.name ? season.name[0].name : 'NONAME' }}
                    </NuxtLink>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${season.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ season.season_number }}
                    </NuxtLink>
                    <NuxtLink :to="`/anime/${route.params.id}/seasons/${season.id}`" class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </NuxtLink>
                </div>
            </div>
            <div v-if="!seasons && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/types/items'
import type { Season } from '~/components/types/seasons'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()
const route = useRoute()

const isFetching = ref<boolean>(false)
const seasons = ref<Season[]>()
const isLoading = ref(false)

const item = ref<Item>()

const fetchSeasons = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Season[]>(`/api/season/admin/item/${route.params.id}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    seasons.value = data.value
    isFetching.value = false
}

const fetchItem = async () => {
    const { data, error } = await useAPI<Item>(`/api/item/admin/${route.params.id}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    item.value = data.value
}

const createSeason = async (attributes: {
    item: string
    name?: {
        locale: string
        name: string
    }[]
    season_number?: number
    references: {
        service: string
        id: string
        season_number?: number
        offset?: number
    }[]
}) => {
    isLoading.value = true

    if (!item.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/season/`, {
        method: 'POST',
        body: {
            item: item.value.id,
            season_number: attributes.season_number && typeof attributes.season_number === 'number' ? attributes.season_number : parseInt(String(attributes.season_number)),
            name:
                attributes.name && attributes.name.length !== 0
                    ? attributes.name.map((d) => {
                          return {
                              locale: d.locale,
                              name: d.name
                          }
                      })
                    : undefined,
            references:
                attributes.references && attributes.references.length !== 0
                    ? attributes.references.map((r) => {
                          return {
                              id: String(r.id),
                              service: r.service,
                              season_number: r.season_number ? parseInt(String(r.season_number)) : undefined,
                              offset: r.offset ? parseInt(String(r.offset)) : undefined
                          }
                      })
                    : undefined
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        return
    }

    isLoading.value = false

    if (!data.value) return
}

const importCrunchy = async () => {
    if (!item.value || !item.value.references || !item.value.references.find((r) => r.service === 'crunchyroll')) return

    const crunchyID = item.value.references.find((r) => r.service === 'crunchyroll')?.id

    const { data, error } = await useAPI<
        [
            {
                id: string
                names: {
                    locale: string
                    name: string
                }[]
                season: number
            }
        ]
    >(`/api/service/crunchyroll/seasons/${crunchyID}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    for (const season of data.value) {
        await createSeason({
            item: item.value.id,
            name: season.names,
            season_number: season.season,
            references: [
                {
                    service: 'crunchyroll',
                    id: season.id
                }
            ]
        })
    }

    await fetchSeasons()
}

const switchSeasons = async (id: string, id_switch: string) => {
    const { error } = await useAPI<{
        id: string
    }>(`/api/season/admin/switch`, {
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

    await fetchSeasons()
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchSeasons()
    fetchItem()
}
</script>

<style></style>
