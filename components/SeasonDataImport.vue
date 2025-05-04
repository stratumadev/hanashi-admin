<template>
    <div
        v-if="isAddDataSeasonActive"
        @click="isAddDataSeasonActive = false"
        class="fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-center bg-[#0000009d] z-10"
    >
        <div @click.stop class="flex flex-col bg-[var(--secondary)] w-[800px] min-h-[500px] max-h-[600px] overflow-y-scroll p-4 border-2 border-white border-opacity-15 rounded-lg">
            <div class="flex flex-col">
                <div class="text-xs mb-2">Crunchyroll Seasons</div>
                <div v-if="crunchySeasons" class="flex flex-col mb-2 gap-2">
                    <div v-for="(cr, index) in crunchySeasons" class="flex flex-row items-center gap-2 text-xs p-3 bg-[var(--tertiary)] rounded-xl">
                        <div class="text-xs">
                            {{ cr.id }}
                        </div>
                        <div class="text-xs">
                            {{ cr.names.find((n) => n.locale === 'de-DE')?.name }}
                        </div>
                        <div class="text-xs">=> Staffel {{ cr.season }}</div>
                        <button
                            @click="selectCrunchySeason(index)"
                            class="flex items-center justify-center text-xs text-white bg-[var(--secondary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl ml-auto"
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="text-xs mb-2">TMDB Seasons</div>
                <div v-if="tmdbSeasons" class="flex flex-col mb-2 gap-2">
                    <div v-for="(tmdb, index) in tmdbSeasons" class="flex flex-row items-center gap-2 text-xs p-3 bg-[var(--tertiary)] rounded-xl">
                        <div class="text-xs">
                            {{ tmdb.id }}
                        </div>
                        <div class="text-xs">
                            {{ tmdb.names.find((n) => n.locale === 'de-DE')?.name }}
                        </div>
                        <div class="text-xs"> => Staffel {{ tmdb.season_number }} </div>
                        <div class="text-xs"> => Episodes {{ tmdb.episode_count }} </div>
                        <button
                            @click="selectTMDBSeason(index)"
                            class="flex items-center justify-center text-xs text-white bg-[var(--secondary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl ml-auto"
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-2">
                <!-- <div class="flex flex-row gap-2 text-xs">
                    <input
                        v-model="crunchyID"
                        class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Crunchyroll-ID"
                    />
                    <button
                        @click="fetchCrunchyroll()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div> -->
                <div class="flex flex-row gap-2 text-xs">
                    <input v-model="asID" class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Anisearch-ID" />
                    <button
                        @click="fetchAnisearch()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div>
                <!-- <div class="flex flex-row gap-2 text-xs">
                    <input
                        v-model="tmdbID"
                        class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="TMDB-ID"
                    />
                    <button
                        @click="fetchTMDB()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div> -->
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Titles</div>
                <div class="grid grid-cols-2">
                    <div v-for="name in names" class="flex flex-row text-xs p-2 gap-2">
                        <input v-model="selectedNames" :value="name" type="checkbox" />
                        <div class="text-xs">
                            {{ name.hoster }}
                        </div>
                        <div class="text-xs">
                            {{ name.locale }}
                        </div>
                        <div class="text-xs">
                            {{ name.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Release Date</div>
                <div class="text-xs">{{ releasedate }}</div>
            </div>
            <button
                @click="sendData()"
                class="flex items-center justify-center text-sm text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-3 rounded-xl mt-4"
            >
                Import
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
const isAddDataSeasonActive = useState<boolean>('isAddDataSeasonActive', () => false)

onUnmounted(() => {
    isAddDataSeasonActive.value = false
})

onMounted(() => {
    isAddDataSeasonActive.value = false
})

const asID = ref<string>()

const crunchySeasons = ref<
    {
        id: string
        names: {
            locale: string
            name: string
        }[]
        season: number
    }[]
>()

const selectedcrunchySeason = ref<{
    id: string
    names: {
        locale: string
        name: string
    }[]
    season: number
}>()

const tmdbSeasons = ref<
    {
        id: number
        names: {
            locale: string
            name: string
        }[]
        episode_count: number
        season_number: number
    }[]
>()

const selectedtmdbSeason = ref<{
    id: number
    names: {
        locale: string
        name: string
    }[]
    episode_count: number
    season_number: number
}>()

const names = ref<
    {
        locale: string
        name: string
        hoster: string
    }[]
>([])

const selectedNames = ref<
    {
        locale: string
        name: string
        hoster: string
    }[]
>([])

const releasedate = ref<Date>()

const emit = defineEmits({
    selectNames(
        payload: {
            locale: string
            name: string
        }[]
    ) {},
    selectReleaseDate(payload: Date) {},
    setReference(payload: { service: string; id: string; season_number?: number; offset?: number }) {}
})

const props = defineProps<{
    tmdb: string | undefined
    crunchyroll: string | undefined
}>()

const sendData = async () => {
    if (selectedNames.value && selectedNames.value.length !== 0) {
        emit('selectNames', selectedNames.value)
    }

    if (releasedate.value) {
        emit('selectReleaseDate', releasedate.value)
    }

    if (selectedcrunchySeason.value) {
        emit('setReference', {
            service: 'crunchyroll',
            id: selectedcrunchySeason.value.id
        })
    }

    if (asID.value) {
        emit('setReference', {
            service: 'anisearch',
            id: asID.value
        })
    }

    if (selectedtmdbSeason.value) {
        emit('setReference', {
            service: 'tmdb',
            id: String(selectedtmdbSeason.value.id),
            season_number: selectedtmdbSeason.value.season_number
        })
    }

    isAddDataSeasonActive.value = false
}

const fetchAnisearch = async () => {
    if (!asID.value) return

    const { data, error } = await useAPI<{
        id: string
        names: {
            locale: string
            name: string
        }[]
        descriptions: {
            locale: string
            description: string
        }[]
        alternative_names: string[]
        release_date: Date
    }>(`/api/service/anisearch/${asID.value}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    names.value.push(
        ...data.value.names.map((n) => {
            return {
                ...n,
                hoster: 'as'
            }
        })
    )
    selectedNames.value.push(
        ...data.value.names.map((n) => {
            return {
                ...n,
                hoster: 'as'
            }
        })
    )
    releasedate.value = data.value.release_date
}

const fetchCrunchyrollSeasons = async () => {
    if (!props.crunchyroll) return

    const { data, error } = await useAPI<
        {
            id: string
            names: {
                locale: string
                name: string
            }[]
            season: number
        }[]
    >(`/api/service/crunchyroll/seasons/${props.crunchyroll}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    crunchySeasons.value = data.value
}

const fetchTMDBSeasons = async () => {
    if (!props.tmdb) return

    const { data, error } = await useAPI<{
        seasons: {
            id: number
            names: {
                locale: string
                name: string
            }[]
            episode_count: number
            season_number: number
        }[]
    }>(`/api/service/tmdb/${props.tmdb}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    tmdbSeasons.value = data.value.seasons
}

const selectTMDBSeason = async (index: number) => {
    if (!tmdbSeasons.value) return

    selectedtmdbSeason.value = tmdbSeasons.value[index]

    names.value.push(
        ...selectedtmdbSeason.value.names.map((n) => {
            return {
                ...n,
                hoster: 'tmdb'
            }
        })
    )
}

const selectCrunchySeason = async (index: number) => {
    if (!crunchySeasons.value) return

    selectedcrunchySeason.value = crunchySeasons.value[index]

    names.value.push(
        ...selectedcrunchySeason.value.names.map((n) => {
            return {
                ...n,
                hoster: 'cr'
            }
        })
    )
}

if (props) {
    if (props.crunchyroll) {
        await fetchCrunchyrollSeasons()
    }

    if (props.tmdb) {
        await fetchTMDBSeasons()
    }
}
</script>

<style></style>
