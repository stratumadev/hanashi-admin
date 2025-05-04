<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink :to="`/calendar`" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                v-if="step === 1 && selectedItem && selectedSeason && release && first_episode && total_episodes"
                @click="((airings = []), nextStep(), (step = 2))"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon v-if="!isLoading" name="formkit:arrowright" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Lade' : 'Weiter' }}
            </button>
            <button
                v-if="step === 2"
                @click="createAirings()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Erstelle' : 'Erstellen' }}
            </button>
        </div>
        <div v-if="step === 1" class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Anime</div>
                <div class="flex flex-col gap-2">
                    <div class="text-sm">
                        {{
                            selectedItem
                                ? selectedItem.name.find((n) => n.locale === 'de-DE')
                                    ? selectedItem.name.find((n) => n.locale === 'de-DE')?.name
                                    : selectedItem.name[0].name
                                : 'Nicht ausgewählt'
                        }}
                    </div>
                    <div class="flex flex-row">
                        <div class="hidden lg:flex relative h-full rounded-lg border-2 border-white border-opacity-40 text-sm text-[#ffffffaf]" ref="searchContainer">
                            <Icon name="ic:outline-search" class="h-5 w-5 absolute top-1/2 -translate-y-1/2 left-2.5" />
                            <input
                                v-model="search"
                                type="text"
                                placeholder="Suche"
                                class="h-full bg-[#ffffff23] placeholder:text-[#ffffffaf] pl-10 pr-4 py-2 outline-none"
                                v-on:keyup.enter="
                                    search
                                        ? navigateTo({
                                              path: '/search',
                                              query: {
                                                  q: search
                                              }
                                          })
                                        : ''
                                "
                            />
                            <Icon v-if="isFetching" name="mdi:loading" class="h-5 w-5 absolute top-1/4 right-1.5 animate-spin" />
                            <div
                                v-if="isSearchActive && '/search' !== route.path"
                                class="absolute top-full left-0 w-full rounded-lg mt-2 border-2 border-white border-opacity-40 text-sm bg-[#292929c0] z-10 flex flex-col p-2 backdrop-blur-sm"
                            >
                                <div v-if="!items || items.length === 0" class="text-center text-sm"> Nichts gefunden </div>
                                <button
                                    v-for="re in items"
                                    class="flex flex-row items-center gap-4 p-2 hover:bg-[#292929b6] rounded-lg select-none font-bold transition-all duration-300"
                                    @click="(toggleSearchContainer(), (selectedItem = re), fetchSeasons(), (selectedSeason = undefined))"
                                >
                                    <div class="relative h-16 w-[2.7rem] min-w-[2.7rem] rounded overflow-hidden bg-[var(--secondary)] hover:bg-[var(--secondary)]">
                                        <img
                                            v-if="re.images && re.images.cover"
                                            :src="`${config.public.origin}/public/${re.images.cover.find((i) => i.height === 600 && i.format === 'avif')?.source}`"
                                            :alt="re.name[0].name"
                                            class="h-full w-full object-cover appear"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div class="text-[12px] leading-snug line-clamp-2">
                                        {{ re.name.find((n) => n.locale === 'de-DE') ? re.name.find((n) => n.locale === 'de-DE')?.name : re.name[0].name }}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Staffeln</div>
                <div v-if="!seasons || seasons.length === 0" class="text-sm"> Kein Anime ausgewählt oder keine Staffel verfügbar </div>
                <select
                    v-if="seasons && seasons.length !== 0"
                    v-model="selectedSeason"
                    class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer"
                >
                    <option :value="undefined">Nicht ausgewählt</option>
                    <option v-for="s in seasons" :value="s">
                        {{ s.season_number ? 'S' + s.season_number + ' - ' : '' }}
                        {{ s.name.find((n) => n.locale === 'de-DE') ? s.name.find((n) => n.locale === 'de-DE')?.name : s.name[0].name }}
                    </option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Erste Folge Release</div>
                <input
                    type="datetime-local"
                    v-model="release"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="Erste Folge"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Erste Folge</div>
                <input
                    type="text"
                    v-model="first_episode"
                    @input="first_episode = validateValue(first_episode)"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="Erste Folge"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Folgen insgesamt</div>
                <div class="flex flex-col">
                    <input
                        type="text"
                        v-model="total_episodes"
                        @input="total_episodes = validateValue(total_episodes)"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        placeholder="Folgen insgesamt"
                    />
                    <div v-if="first_episode && total_episodes" class="text-sm">
                        {{ total_episodes !== 1 ? 'Folgen' : 'Folge' }}:
                        {{ first_episode }}
                        {{ total_episodes !== 1 ? ` - ${first_episode - 1 + total_episodes}` : '' }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Typ</div>
                <select v-model="type" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="sub">Sub</option>
                    <option value="dub">Dub</option>
                </select>
            </div>
        </div>
        <div v-if="step === 2" class="flex flex-col mt-10 gap-3 text-sm">
            <div v-for="airing in airings" class="flex flex-row bg-[var(--secondary)] rounded-xl p-3 gap-3">
                <div class="flex flex-col">
                    <div class="text-xs">Folge</div>
                    <input
                        type="text"
                        v-model="airing.episode_number"
                        @input="airing.episode_number = validateValue(airing.episode_number)"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        placeholder="Folge"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="text-xs">Release</div>
                    <input
                        type="datetime-local"
                        v-model="airing.release_date"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        placeholder="Release"
                    />
                </div>
                <div class="flex flex-col">
                    <div class="text-xs">Typ</div>
                    <select v-model="airing.type" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                        <option value="sub">Sub</option>
                        <option value="dub">Dub</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { AiringCreate } from '~/components/types/airings'
import type { Item } from '~/components/types/items'
import type { Season } from '~/components/types/seasons'

definePageMeta({
    layout: 'admin'
})

const isLoading = ref(false)

const route = useRoute()

const config = useRuntimeConfig()

const step = ref<number>(1)

const first_episode = ref<number | undefined>()
const total_episodes = ref<number | undefined>(1)
const type = ref<'sub' | 'dub'>('sub')
const release = ref<Date>()

const selectedItem = ref<Item>()
const items = ref<Item[]>()
const selectedSeason = ref<Season>()
const seasons = ref<Season[]>()
const search = ref<string>()
const airings = ref<AiringCreate[]>([])

const isFetching = ref<boolean>(false)
const searchContainer = ref<HTMLDivElement | null>(null)
const isSearchActive = ref<boolean>(false)

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

const createAirings = async () => {
    isLoading.value = true

    if (!selectedItem.value) return

    if (!selectedSeason.value) return

    if (!airings.value || airings.value.length === 0) return

    const { data, error } = await useAPI(`/api/airing/mass`, {
        method: 'POST',
        body: airings.value.map((a) => {
            return {
                item: selectedItem.value?.id,
                season: selectedSeason.value?.id,
                release_date: new Date(a.release_date).toISOString(),
                episode_number: a.episode_number && typeof a.episode_number === 'number' ? a.episode_number : parseInt(String(a.episode_number)),
                type: a.type,
                locale: a.locale
            }
        })
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        return
    }

    isLoading.value = false

    navigateTo('/calendar')
}

const fetchSearch = async () => {
    const { data, error } = await useAPI<Item[]>(`/api/item/admin`, {
        method: 'GET',
        params: {
            search: search.value,
            limit: 3
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    items.value = data.value
}

const fetchSeasons = async () => {
    if (!selectedItem.value) return

    const { data, error } = await useAPI<Season[]>(`/api/season/admin/item/${selectedItem.value.id}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    seasons.value = data.value
}

const nextStep = async () => {
    if (!selectedItem.value || !selectedSeason.value || !release.value || !first_episode.value || !total_episodes.value) return

    let releaseDate = new Date(release.value)

    for (let i = 0; i < total_episodes.value; i++) {
        const year = releaseDate.getFullYear()
        const month = String(releaseDate.getMonth() + 1).padStart(2, '0')
        const day = String(releaseDate.getDate()).padStart(2, '0')
        const hours = String(releaseDate.getHours()).padStart(2, '0')
        const minutes = String(releaseDate.getMinutes()).padStart(2, '0')

        const formattedReleaseDate = `${year}-${month}-${day}T${hours}:${minutes}`

        airings.value.push({
            item: selectedItem.value.id,
            season: selectedSeason.value.id,
            episode: undefined,
            release_date: formattedReleaseDate as any,
            episode_number: first_episode.value + i,
            type: type.value,
            locale: 'de-DE'
        })

        releaseDate.setDate(releaseDate.getDate() + 7)
    }
}

const debounce = (func: any, delay: any) => {
    let debounceTimer: any
    return function (this: any) {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
}

const toggleSearchContainer = () => {
    isSearchActive.value = !isSearchActive.value

    if (isSearchActive.value) {
        setTimeout(() => {
            document.addEventListener('click', closeSearchContainer)
        }, 0)
    } else {
        setTimeout(() => {
            document.removeEventListener('click', closeSearchContainer)
        }, 0)
    }
}

const closeSearchContainer = (event: Event) => {
    const targetNode = event.target as Node
    if (searchContainer.value && !searchContainer.value.contains(targetNode)) {
        isSearchActive.value = false
        document.removeEventListener('click', closeSearchContainer)
    }
}

const debouncedFetchSearch = debounce(fetchSearch, 500)

watch(search, () => {
    if (search.value) {
        if (!isSearchActive.value) {
            toggleSearchContainer()
        }
    } else {
        if (isSearchActive.value) {
            toggleSearchContainer()
        }
    }
    debouncedFetchSearch()
})

const validateValue = (value: string | number | undefined) => {
    if (!value) return

    if (typeof value === 'number') return value

    value = value.replace(/[^0-9.]/g, '')

    return value ? parseFloat(value) : undefined
}
</script>

<style></style>
