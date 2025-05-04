<template>
    <div v-if="season" class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes/masslinker`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" name="game-icons:fleshy-mass" class="h-4 w-4" />
                Masslinker
            </NuxtLink>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${season.id}/episodes`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" name="carbon:next-filled" class="h-3 w-3" />
                Episoden
            </NuxtLink>
            <button
                @click="isAddDataSeasonActive = true"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" name="mdi:import" class="h-3 w-3" />
                Import
            </button>
            <button
                @click="deleteSeason()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="changeSeason()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon mode="svg" v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <div class="flex flex-col gap-2">
                    <div v-for="n in season.name" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="n.locale" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <input v-model="n.name" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Name" />
                        <button @click="deleteNameFromArray(n)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="dummyName.locale" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <input
                            v-model="dummyName.name"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Name"
                        />
                        <button @click="addDummyNameToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Season Number</div>
                <input
                    type="text"
                    v-model="season.season_number"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="Season Number"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Release</div>
                <input
                    type="date"
                    v-model="season.metadata.release_date"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">References</div>
                <div class="flex flex-col gap-2">
                    <div v-for="r in season.references" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="r.service" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="s in services" :value="s.system_name">
                                {{ s.name }}
                            </option>
                        </select>
                        <input v-model="r.id" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="ID" />
                        <input
                            v-model="r.season_number"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Season Number"
                        />
                        <input
                            v-model="r.offset"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Offset"
                        />
                        <button @click="deleteReferenceFromArray(r)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="dummyReference.service" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="s in services" :value="s.system_name">
                                {{ s.name }}
                            </option>
                        </select>
                        <input
                            v-model="dummyReference.id"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="ID"
                        />
                        <input
                            v-model="dummyReference.season_number"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Season Number"
                        />
                        <input
                            v-model="dummyReference.offset"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Offset"
                        />
                        <button @click="addDummyReferenceToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <SeasonDataImport
            v-if="item && season"
            :tmdb="item.references?.find((r) => r.service === 'tmdb')?.id"
            :crunchyroll="item.references?.find((r) => r.service === 'crunchyroll')?.id"
            @selectNames="(d) => season?.name.push(...d)"
            @selectReleaseDate="(d) => selectReleaseDate(d)"
            @setReference="(d) => season?.references?.push(d)"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Item, ItemCreate } from '~/components/types/items'
import type { Season } from '~/components/types/seasons'
import type { Userdata } from '~/components/types/userdata'

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const config = useRuntimeConfig()

const isLoading = ref(false)

const isAddDataSeasonActive = useState<boolean>('isAddDataSeasonActive', () => false)

const languages = ref<
    {
        name: string
        iso: string
    }[]
>([
    {
        name: 'Deutsch',
        iso: 'de-DE'
    },
    {
        name: 'Englisch',
        iso: 'en-US'
    },
    {
        name: 'Romanji',
        iso: 'ja-JP-R'
    },
    {
        name: 'Japanisch',
        iso: 'ja-JP'
    },
    {
        name: 'Spanisch',
        iso: 'es-ES'
    },
    {
        name: 'Französisch',
        iso: 'fr-FR'
    },
    {
        name: 'Italienisch',
        iso: 'it-IT'
    },
    {
        name: 'Chinesisch',
        iso: 'zh-CN'
    },
    {
        name: 'Russisch',
        iso: 'ru-RU'
    }
])

const services = ref<
    {
        name: string
        system_name: string
    }[]
>([
    {
        name: 'Crunchyroll',
        system_name: 'crunchyroll'
    },
    {
        name: 'Anisearch',
        system_name: 'anisearch'
    },
    {
        name: 'TMDB',
        system_name: 'tmdb'
    }
])

const dummyName = ref<{
    locale: string
    name: string
}>({
    locale: 'de-DE',
    name: ''
})

const dummyReference = ref<{
    service: string
    id: string
    offset?: number
    season_number?: number
}>({
    service: 'crunchyroll',
    id: '',
    season_number: undefined
})

const addDummyNameToArray = () => {
    if (!dummyName.value) return

    if (!season.value) return

    season.value.name.push(dummyName.value)

    dummyName.value = {
        locale: 'de-DE',
        name: ''
    }
}

const addDummyReferenceToArray = () => {
    if (!dummyReference.value) return

    if (!season.value) return

    if (!season.value.references) {
        season.value.references = []
    }

    season.value.references.push(dummyReference.value)

    dummyReference.value = {
        service: 'crunchyroll',
        id: '',
        season_number: undefined
    }
}

const deleteNameFromArray = (name: { locale: string; name: string }) => {
    if (!season.value) return

    const index = season.value.name.findIndex((i) => i === name)

    if (index !== -1) {
        season.value.name.splice(index, 1)
    }
}

const deleteReferenceFromArray = (reference: { service: string; id: string; offset?: number; url?: string }) => {
    if (!season.value || !season.value.references) return

    const index = season.value.references.findIndex((i) => i === reference)

    if (index !== -1) {
        season.value.references.splice(index, 1)
    }
}

const selectReleaseDate = async (releaseDate: Date) => {
    if (!season.value) return

    const date = new Date(releaseDate)

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    season.value.metadata.release_date = `${year}-${month}-${day}`
}

const item = ref<Item>()

const season = ref<Season>()

const changeSeason = async () => {
    isLoading.value = true

    if (!season.value) return
    if (!item.value) return

    var date: string | undefined

    if (season.value.metadata && season.value.metadata.release_date) {
        date = new Date(season.value.metadata.release_date).toISOString()
    }

    const { data, error } = await useAPI(`/api/season/`, {
        method: 'PUT',
        body: {
            id: season.value.id,
            item: item.value.id,
            season_number: season.value.season_number && typeof season.value.season_number === 'number' ? season.value.season_number : parseInt(String(season.value.season_number)),
            name:
                season.value.name && season.value.name.length !== 0
                    ? season.value.name.map((d) => {
                          return {
                              locale: d.locale,
                              name: d.name
                          }
                      })
                    : undefined,
            metadata:
                season.value.metadata && season.value.metadata.release_date && date
                    ? {
                          release_date: date
                      }
                    : undefined,
            references:
                season.value.references && season.value.references.length !== 0
                    ? season.value.references.map((r) => {
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

const fetchSeason = async () => {
    const { data, error } = await useAPI<Season>(`/api/season/admin/${route.params.season}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value.metadata) {
        data.value.metadata = {
            release_date: undefined
        }
    }

    if (data.value.metadata.release_date) {
        const date = new Date(data.value.metadata.release_date)

        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')

        data.value.metadata.release_date = `${year}-${month}-${day}`
    }

    season.value = data.value
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

const deleteSeason = async () => {
    isLoading.value = true

    if (!season.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/season/${season.value.id}`, {
        method: 'DELETE'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false

        // addToast({
        //     title: "Fehler",
        //     description: "Konnte nicht gelöscht werden!",
        //     timeout: 5000,
        //     color: "#aa413a",
        // });
        return
    }

    // addToast({
    //     title: "Gelöscht",
    //     description: "Kategorie gelöscht!",
    //     timeout: 5000,
    //     color: "#2d9124",
    // });

    isLoading.value = false

    navigateTo(`/anime/${route.params.id}/seasons`)
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchItem()
    fetchSeason()
}
</script>

<style></style>
