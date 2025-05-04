<template>
    <div v-if="isAddDataAnimeActive" @click="isAddDataAnimeActive = false" class="fixed top-0 left-0 h-screen w-full flex flex-col items-center justify-center bg-[#0000009d] z-10">
        <div @click.stop class="flex flex-col bg-[var(--secondary)] w-[800px] min-h-[500px] max-h-[600px] overflow-y-scroll p-4 border-2 border-white border-opacity-15 rounded-lg">
            <div class="flex flex-row gap-2">
                <div class="flex flex-row gap-2 text-xs">
                    <input v-model="crunchyID" class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Crunchyroll-ID" />
                    <button
                        @click="fetchCrunchyroll()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div>
                <div class="flex flex-row gap-2 text-xs">
                    <input v-model="asID" class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Anisearch-ID" />
                    <button
                        @click="fetchAnisearch()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div>
                <div class="flex flex-row gap-2 text-xs">
                    <input v-model="tmdbID" class="w-full px-2 py-1.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="TMDB-ID" />
                    <button
                        @click="fetchTMDB()"
                        class="flex items-center justify-center text-xs text-white bg-[var(--tertiary)] hover:bg-black transition-all duration-300 px-2 py-1 rounded-xl"
                    >
                        Import
                    </button>
                </div>
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
                <div class="text-xs">Alternative Titles</div>
                <div class="grid grid-cols-2">
                    <div v-for="t in alternative_names" class="flex flex-row text-xs p-2 gap-2">
                        <input v-model="selectedAlternative_names" :value="t" type="checkbox" />
                        <div class="text-xs">
                            {{ t }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Descriptions</div>
                <div class="grid grid-cols-2">
                    <div v-for="t in descriptions" class="flex flex-row text-xs p-2 gap-2">
                        <input v-model="selectedDescriptions" :value="t" type="checkbox" />
                        <div class="text-xs">
                            {{ t.hoster }}
                        </div>
                        <div class="text-xs">
                            {{ t.locale }}
                        </div>
                        <div class="text-xs line-clamp-3">
                            {{ t.description }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Banner</div>
                <div class="grid grid-cols-5">
                    <div v-for="t in banners" class="flex flex-row text-xs p-2 gap-2">
                        <input v-model="selectedBanner" :value="t" type="checkbox" />
                        <img :src="t" class="h-14" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Cover</div>
                <div class="grid grid-cols-5">
                    <div v-for="t in posters" class="flex flex-row text-xs p-2 gap-2">
                        <input v-model="selectedPoster" :value="t" type="checkbox" />
                        <img :src="t" class="h-24" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col mt-2">
                <div class="text-xs">Categories</div>
                <div class="flex flex-row gap-1 mt-1">
                    <div v-for="ca in categories" class="text-xs">
                        {{ ca.name[0].name }}
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
import type { Category } from './types/categories'

const isAddDataAnimeActive = useState<boolean>('isAddDataAnimeActive', () => false)

onUnmounted(() => {
    isAddDataAnimeActive.value = false
})

onMounted(() => {
    isAddDataAnimeActive.value = false
})

const crunchyID = ref<string>()
const asID = ref<string>()
const tmdbID = ref<string>()

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

const alternative_names = ref<string[]>([])

const selectedAlternative_names = ref<string[]>([])

const banners = ref<string[]>([])

const selectedBanner = ref<string[]>([])

const posters = ref<string[]>([])

const selectedPoster = ref<string[]>([])

const descriptions = ref<
    {
        locale: string
        description: string
        hoster: string
    }[]
>([])

const selectedDescriptions = ref<
    {
        locale: string
        description: string
        hoster: string
    }[]
>([])

const categories = ref<Category[]>([])

const releasedate = ref<Date>()

const emit = defineEmits({
    selectNames(
        payload: {
            locale: string
            name: string
        }[]
    ) {},
    selectAlternativeNames(payload: string[]) {},
    selectDescriptions(
        payload: {
            locale: string
            description: string
        }[]
    ) {},
    selectReleaseDate(payload: Date) {},
    setReference(payload: { service: string; id: string; url?: string }) {},
    selectBanner(payload: string) {},
    selectCover(payload: string) {},
    selectCategories(payload: Category[]) {}
})

const sendData = async () => {
    if (selectedNames.value && selectedNames.value.length !== 0) {
        emit('selectNames', selectedNames.value)
    }

    if (selectedAlternative_names.value && selectedAlternative_names.value.length !== 0) {
        emit('selectAlternativeNames', selectedAlternative_names.value)
    }

    if (selectedDescriptions.value && selectedDescriptions.value.length !== 0) {
        emit('selectDescriptions', selectedDescriptions.value)
    }

    if (selectedBanner.value && selectedBanner.value.length !== 0) {
        emit('selectBanner', selectedBanner.value[0])
    }

    if (selectedPoster.value && selectedPoster.value.length !== 0) {
        emit('selectCover', selectedPoster.value[0])
    }

    if (releasedate.value) {
        emit('selectReleaseDate', releasedate.value)
    }

    if (categories.value) {
        emit('selectCategories', categories.value)
    }

    if (crunchyID.value) {
        emit('setReference', {
            service: 'crunchyroll',
            id: crunchyID.value
        })
    }

    if (asID.value) {
        emit('setReference', {
            service: 'anisearch',
            id: asID.value
        })
    }

    if (tmdbID.value) {
        emit('setReference', {
            service: 'tmdb',
            id: tmdbID.value
        })
    }

    isAddDataAnimeActive.value = false
}

const fetchCrunchyroll = async () => {
    if (!crunchyID.value) return

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
        images: {
            poster: string
            banner: string
        }
    }>(`/api/service/crunchyroll/series/${crunchyID.value}`, {
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
                hoster: 'cr'
            }
        })
    )
    descriptions.value.push(
        ...data.value.descriptions.map((n) => {
            return {
                ...n,
                hoster: 'cr'
            }
        })
    )
    banners.value.push(data.value.images.banner)
    posters.value.push(data.value.images.poster)
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
        categories: Category[]
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
    alternative_names.value.push(...data.value.alternative_names)
    selectedAlternative_names.value.push(...data.value.alternative_names)
    releasedate.value = data.value.release_date
    descriptions.value.push(
        ...data.value.descriptions.map((n) => {
            return {
                ...n,
                hoster: 'as'
            }
        })
    )
    selectedDescriptions.value.push(
        ...data.value.descriptions.map((n) => {
            return {
                ...n,
                hoster: 'as'
            }
        })
    )

    categories.value.push(...data.value.categories)
}

const fetchTMDB = async () => {
    if (!tmdbID.value) return

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
        images: {
            poster: string[]
            banner: string[]
        }
    }>(`/api/service/tmdb/${tmdbID.value}`, {
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
                hoster: 'tmdb'
            }
        })
    )
    descriptions.value.push(
        ...data.value.descriptions.map((n) => {
            return {
                ...n,
                hoster: 'tmdb'
            }
        })
    )
    banners.value.push(...data.value.images.banner)
    posters.value.push(...data.value.images.poster)
}
</script>

<style></style>
