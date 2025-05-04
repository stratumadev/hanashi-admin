<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold text-white">
        <div class="flex flex-row font-dm text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                v-if="step === 2"
                @click="massUpload()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" v-if="!isLoading" name="mdi:import" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Uploading' : 'Start Upload' }}
            </button>
            <button
                v-if="step === 1"
                @click="nextStep()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" v-if="!isLoading" name="formkit:arrowright" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Lade' : 'Weiter' }}
            </button>
        </div>
        <div v-if="step === 1" class="flex flex-col text-sm">
            <div v-if="episodes" class="flex flex-row items-center gap-3 py-4">
                <div class="text-sm">Offset</div>
                <select v-model="offset" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option :value="0">Kein Offset</option>
                    <option v-for="(e, i) in episodes" :value="i + 1"> Folge {{ i + 1 }} </option>
                </select>
            </div>
            <div v-for="(item, index) in linksArray" :key="index" class="flex flex-col gap-2 py-4">
                <textarea
                    v-model="item.links"
                    @input="item.formatedLinks = stringToArray(item.links, index)"
                    class="bg-[var(--tertiary)] h-96 w-full rounded-xl focus:outline-none p-5"
                ></textarea>

                <div class="flex flex-row items-center gap-3 text-xs">
                    <div class="text-xs"> {{ item.formatedLinks.length }} Links angegeben </div>
                    <select v-model="item.hoster" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                        <option :value="undefined" disabled selected> Wähle einen Hoster </option>
                        <option v-for="h in hoster" :value="h.id">
                            {{ h.name }}
                        </option>
                    </select>
                    <select v-model="item.type" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                        <option value="sub">Sub</option>
                        <option value="dub">Dub</option>
                    </select>
                    <button
                        v-if="linksArray.length === index + 1"
                        @click="addLinksArray()"
                        class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl ml-auto"
                    >
                        <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                    </button>
                    <button
                        v-if="linksArray.length === index + 1 && index !== 0"
                        @click="removeLinksArray(index)"
                        class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl ml-1"
                    >
                        <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
        <div v-if="step === 2" class="flex flex-col text-sm py-4 gap-4">
            <div class="flex flex-row gap-3">
                <div class="flex flex-col gap-2 text-xs">
                    <div class="text-xs">Crunchy Import</div>
                    <input
                        v-model="crunchyData.id"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Season ID"
                    />
                    <input
                        v-model="crunchyData.offset"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Episode Offset"
                    />
                    <button
                        @click="importCrunchyrollEpisodes()"
                        class="flex items-center justify-center w-full text-white bg-[var(--tertiary)] h-10 rounded-xl"
                        :disabled="!crunchyData.id"
                    >
                        Import
                    </button>
                </div>
                <div class="flex flex-col gap-2 text-xs">
                    <div class="text-xs">TMDB Import</div>
                    <input
                        v-model="tmdbData.id"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Series ID"
                    />
                    <input
                        v-model="tmdbData.season"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Season"
                    />
                    <input
                        v-model="tmdbData.offset"
                        class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                        type="text"
                        placeholder="Episode Offset"
                    />
                    <button
                        @click="importTMDBEpisodes()"
                        class="flex items-center justify-center w-full text-white bg-[var(--tertiary)] h-10 rounded-xl"
                        :disabled="!tmdbData.season || !tmdbData.id"
                    >
                        Import
                    </button>
                </div>
            </div>
            <div v-for="(episode, index) in episodes" class="flex flex-row p-5 gap-2 bg-[var(--secondary)] rounded-xl">
                <div @click="openFileInputBanner(index)" class="h-[125px] w-[200px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon mode="svg" v-if="!episode.bannerObject && !episode.images?.banner" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="episode.bannerObject" alt="Image" class="h-full w-full object-cover rounded" :src="episode.bannerObject" />
                    <img
                        v-if="!episode.bannerObject && episode.images && episode.images.banner"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${episode.images.banner.find((i) => i.height === 450 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" :id="`fileInputBanner-${index}`" @change="(e) => handleFileUploadBanner(e, index)" accept="image/png, image/jpeg, image/webp" class="hidden" />
                <div class="flex flex-col gap-2 text-xs">
                    <div class="text-xs">Name</div>
                    <div v-for="(n, i) in episode.name" class="relative w-full flex flex-col gap-2 max-w-xs">
                        <select
                            v-model="n.locale"
                            class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index ? true : false"
                        >
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <input
                            v-model="n.name"
                            class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Name"
                            :class="episode.index ? 'cursor-not-allowed' : ''"
                            :disabled="episode.index ? true : false"
                        />
                        <div class="flex flex-row justify-between">
                            <button
                                v-if="i !== 0"
                                @click="deleteNameFromArray(i, index)"
                                class="items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                                :class="episode.index ? 'hidden' : 'flex'"
                            >
                                <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                            </button>
                            <button
                                v-if="episode.name.length === i + 1"
                                @click="addDummyNameToArray(index)"
                                class="items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                                :class="episode.index ? 'hidden' : 'flex'"
                            >
                                <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 text-xs">
                    <div class="text-xs">Description</div>
                    <div v-for="(d, i) in episode.description" class="relative w-full flex flex-col gap-2 max-w-xs">
                        <select
                            v-model="d.locale"
                            class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index ? true : false"
                        >
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <textarea
                            v-model="d.description"
                            class="w-[300px] h-24 px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Description"
                            :class="episode.index ? 'cursor-not-allowed' : ''"
                            :disabled="episode.index ? true : false"
                        />
                        <div class="flex flex-row justify-between">
                            <button
                                v-if="i !== 0"
                                @click="deleteDescriptionFromArray(i, index)"
                                class="items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                                :class="episode.index ? 'hidden' : 'flex'"
                            >
                                <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                            </button>
                            <button
                                v-if="episode.description.length === i + 1"
                                @click="addDummyDescriptionToArray(index)"
                                class="items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                                :class="episode.index ? 'hidden' : 'flex'"
                            >
                                <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 text-xs">
                    <div class="flex flex-col gap-2">
                        <div class="text-xs">Release Date</div>
                        <input
                            type="date"
                            v-model="episode.metadata.release_date"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index ? true : false"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xs">Episode Number</div>
                        <input
                            type="text"
                            v-model="episode.episode_number"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            placeholder="Episode Number"
                            :class="episode.index ? 'cursor-not-allowed' : ''"
                            :disabled="episode.index ? true : false"
                        />
                    </div>
                </div>
                <div class="flex flex-col gap-2 text-xs">
                    <div class="text-xs">Streams</div>
                    <div v-for="(d, i) in episode.episode_streams" class="relative w-full flex flex-col gap-2 max-w-xs">
                        <select
                            v-model="d.hoster"
                            class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index && d.id ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index && d.id ? true : false"
                        >
                            <option v-for="l in hoster" :value="l.id">
                                {{ l.name }}
                            </option>
                        </select>
                        <select
                            v-model="d.locale"
                            class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index && d.id ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index && d.id ? true : false"
                        >
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <select
                            v-model="d.type"
                            class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            :class="episode.index && d.id ? 'cursor-not-allowed' : 'cursor-pointer'"
                            :disabled="episode.index && d.id ? true : false"
                        >
                            <option value="sub">Sub</option>
                            <option value="dub">Dub</option>
                        </select>
                        <input
                            v-model="d.video_id"
                            class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Video ID"
                            :class="episode.index && d.id ? 'cursor-not-allowed' : ''"
                            :disabled="episode.index && d.id ? true : false"
                        />
                        <div class="flex flex-row justify-between">
                            <button
                                v-if="i !== 0"
                                @click="deleteStreamFromArray(i, index)"
                                class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                            >
                                <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                            </button>
                            <button
                                v-if="episode.episode_streams && episode.episode_streams.length === i + 1"
                                @click="addDummyStreamToArray(index)"
                                class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                            >
                                <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Episode, EpisodeMasslinker } from '~/components/types/episodes'
import type { Hoster } from '~/components/types/hosters'
import type { Item } from '~/components/types/items'
import type { Season } from '~/components/types/seasons'
import type { Userdata } from '~/components/types/userdata'
import { useToast } from '@/plugins/useToast'
const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const tmdbData = ref<{
    id: string
    season: number | undefined
    offset: number | undefined
}>({
    id: '',
    season: undefined,
    offset: undefined
})

const crunchyData = ref<{
    id: string
    offset: number | undefined
}>({
    id: '',
    offset: undefined
})

const config = useRuntimeConfig()

const isLoading = ref<boolean>(false)

const offset = ref<number>(0)

const linksArrayTemplate = ref<{
    links: string
    formatedLinks: string[]
    hoster: string | undefined
    type: 'sub' | 'dub'
}>({
    links: '',
    formatedLinks: [],
    hoster: undefined,
    type: 'sub'
})

const linksArray = ref<
    {
        links: string
        formatedLinks: string[]
        hoster: string | undefined
        type: 'sub' | 'dub'
    }[]
>([
    {
        links: '',
        formatedLinks: [],
        hoster: undefined,
        type: 'sub'
    }
])

const route = useRoute()

const item = ref<Item>()

const season = ref<Season>()

const hoster = ref<Hoster[]>()

const episodes = ref<EpisodeMasslinker[]>([])

const step = ref<number>(1)

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

const stringToArray = (links: string, index: number): string[] => {
    const l = links.split('\n').filter((link) => link.trim() !== '')

    if (l && l.length !== 0 && hoster.value) {
        for (const h of hoster.value) {
            for (const d of h.domains) {
                const inc = l[0].includes(d.domain)

                if (inc) {
                    linksArray.value[index].hoster = h.id
                }
            }
        }
    }

    return l
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

    if (data.value.references && data.value.references.find((r) => r.service === 'tmdb')) {
        const tmdb = data.value.references.find((r) => r.service === 'tmdb')

        if (!tmdb) return

        tmdbData.value = {
            id: tmdb.id,
            season: 0,
            offset: undefined
        }
    }
}

const fetchSeason = async () => {
    const { data, error } = await useAPI<Season>(`/api/season/admin/${route.params.season}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    season.value = data.value

    if (data.value.references && data.value.references.find((r) => r.service === 'crunchyroll')) {
        const cr = data.value.references.find((r) => r.service === 'crunchyroll')

        if (!cr) return

        crunchyData.value = {
            id: cr.id,
            offset: cr.offset ?? undefined
        }
    }

    if (data.value.references && data.value.references.find((r) => r.service === 'tmdb')) {
        const tmdb = data.value.references.find((r) => r.service === 'tmdb')

        if (!tmdb) return

        tmdbData.value.season = tmdb.season_number ?? undefined
        tmdbData.value.offset = tmdb.offset ?? undefined
    }
}

const fetchHoster = async () => {
    const { data, error } = await useAPI<Hoster[]>(`/api/hoster/admin`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    hoster.value = data.value
}

const fetchEpisodes = async () => {
    const { data, error } = await useAPI<EpisodeMasslinker[]>(`/api/episode/admin/season/${route.params.season}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    episodes.value = data.value
}

const addLinksArray = async () => {
    linksArray.value.push(await JSON.parse(JSON.stringify(linksArrayTemplate.value)))
}

const removeLinksArray = (index: number) => {
    if (index !== -1) {
        linksArray.value.splice(index, 1)
    }
}

const userdata = useState<Userdata | null>('userdata', () => null)

const nextStep = async () => {
    isLoading.value = true
    for (const links of linksArray.value) {
        for (const [i, l] of links.formatedLinks.entries()) {
            if (!episodes.value[i + offset.value]) {
                episodes.value.push({
                    type: '3rdparty',
                    name: [
                        {
                            locale: 'de-DE',
                            name: `Folge ${i + offset.value + 1}`
                        }
                    ],
                    description: [
                        {
                            locale: 'de-DE',
                            description: `Keine Beschreibung`
                        }
                    ],
                    metadata: {
                        release_date: undefined
                    },
                    episode_streams: [
                        {
                            hoster: links.hoster,
                            type: links.type,
                            locale: 'de-DE',
                            video_id: extractIdFromUrl(l)
                        }
                    ]
                })
            } else {
                if (episodes.value[i + offset.value].episode_streams) {
                    episodes.value[i + offset.value].episode_streams!.push({
                        hoster: links.hoster,
                        type: links.type,
                        locale: 'de-DE',
                        video_id: extractIdFromUrl(l)
                    })
                }
            }
        }
    }

    step.value = 2

    isLoading.value = false
}

function extractIdFromUrl(url: string) {
    const trimmedUrl = url.endsWith('/') ? url.slice(0, -1) : url

    const lastSlashIndex = trimmedUrl.lastIndexOf('/')
    if (lastSlashIndex === -1) {
        return undefined
    }

    const id = trimmedUrl.substring(lastSlashIndex + 1)
    return id || undefined
}

const handleFileUploadBanner = (event: Event, index: number) => {
    const inputElement = event.target as HTMLInputElement

    if (!episodes.value) return

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        episodes.value[index].bannerBlob = file
        episodes.value[index].bannerObject = URL.createObjectURL(file)
    }
}

const openFileInputBanner = (index: number) => {
    document!.getElementById(`fileInputBanner-${index}`)!.click()
}

const addDummyNameToArray = (episode: number) => {
    if (!episodes.value) return

    episodes.value[episode].name.push({
        locale: 'de-DE',
        name: ''
    })
}

const deleteNameFromArray = (nameindex: number, index: number) => {
    if (!item.value) return

    episodes.value[index].name.splice(nameindex, 1)
}

const addDummyDescriptionToArray = (episode: number) => {
    if (!episodes.value) return

    episodes.value[episode].description.push({
        locale: 'de-DE',
        description: ''
    })
}

const deleteDescriptionFromArray = (desindex: number, index: number) => {
    if (!item.value) return

    episodes.value[index].description.splice(desindex, 1)
}

const addDummyStreamToArray = (episode: number) => {
    if (!episodes.value) return

    if (!hoster.value) return

    if (!episodes.value[episode].episode_streams) {
        episodes.value[episode].episode_streams = []
    }

    episodes.value[episode].episode_streams.push({
        hoster: hoster.value[0].id,
        locale: 'de-DE',
        type: 'sub',
        video_id: ''
    })
}

const importCrunchyrollEpisodes = async () => {
    if (!crunchyData.value) return

    if (!episodes.value) return

    const { data, error } = await useAPI<
        {
            id: string
            names: {
                locale: string
                name: string
            }[]
            description: {
                locale: string
                description: string
            }[]
            episode_number: number
            release_date: Date
            images: {
                banner: string
            }
        }[]
    >(`/api/service/crunchyroll/episodes/${crunchyData.value.id}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    for (const [i, e] of episodes.value.entries()) {
        if (!e.index) {
            var offset = Number(crunchyData.value.offset) ?? 0

            if (isNaN(offset)) {
                offset = 0
            }

            if (!data.value[i + offset]) return

            if (!e.references) {
                e.references = []
            }

            e.references.push({
                service: 'crunchyroll',
                id: String(data.value[i + offset].id)
            })

            if (data.value[i + offset].names && data.value[i + offset].names.length !== 0) {
                const crn = e.name.find((n) => n.locale === 'de-DE')

                if (crn) {
                    crn.name = data.value[i + offset].names[0].name
                } else {
                    e.name.push({
                        locale: 'de-DE',
                        name: data.value[i + offset].names[0].name
                    })
                }
            }

            if (data.value[i + offset].description && data.value[i + offset].description.length !== 0) {
                const crn = e.description.find((n) => n.locale === 'de-DE')

                if (crn) {
                    crn.description = data.value[i + offset].description[0].description
                } else {
                    e.description.push({
                        locale: 'de-DE',
                        description: data.value[i + offset].description[0].description
                    })
                }
            }

            if (data.value[i + offset].episode_number) {
                e.episode_number = data.value[i + offset].episode_number
            }

            if (data.value[i + offset].release_date) {
                e.metadata.release_date = data.value[i + offset].release_date
            }

            if (data.value[i + offset].images && data.value[i + offset].images.banner) {
                const response = await fetch(data.value[i + offset].images.banner)
                const blob = await response.blob()
                e.bannerBlob = blob
                e.bannerObject = URL.createObjectURL(blob)
            }
        }
    }
}

const importTMDBEpisodes = async () => {
    if (!tmdbData.value) return

    if (!episodes.value) return

    const { data, error } = await useAPI<
        {
            id: number
            names: {
                locale: string
                name: string
            }[]
            descriptions: {
                locale: string
                description: string
            }[]
            episode_number: number
            image: string
            air_date: string
        }[]
    >(`/api/service/tmdb/episodes/${tmdbData.value.id}/${tmdbData.value.season}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    for (const [i, e] of episodes.value.entries()) {
        if (!e.index) {
            var offset = Number(tmdbData.value.offset) ?? 0

            if (isNaN(offset)) {
                offset = 0
            }

            if (!data.value[i + offset]) return

            if (!e.references) {
                e.references = []
            }

            e.references.push({
                service: 'tmdb',
                id: String(data.value[i + offset].id)
            })

            if (data.value[i + offset].names && data.value[i + offset].names.length !== 0) {
                const crn = e.name.find((n) => n.locale === 'de-DE')

                if (crn) {
                    crn.name = data.value[i + offset].names[0].name
                } else {
                    e.name.push({
                        locale: 'de-DE',
                        name: data.value[i + offset].names[0].name
                    })
                }
            }

            if (data.value[i + offset].descriptions && data.value[i + offset].descriptions.length !== 0) {
                const crn = e.description.find((n) => n.locale === 'de-DE')

                if (crn) {
                    crn.description = data.value[i + offset].descriptions[0].description
                } else {
                    e.description.push({
                        locale: 'de-DE',
                        description: data.value[i + offset].names[0].name
                    })
                }
            }

            if (data.value[i + offset].episode_number) {
                e.episode_number = data.value[i + offset].episode_number
            }

            if (data.value[i + offset].air_date) {
                e.metadata.release_date = data.value[i + offset].air_date as any
            }

            if (data.value[i + offset].image) {
                const response = await fetch(data.value[i + offset].image)
                const blob = await response.blob()
                e.bannerBlob = blob
                e.bannerObject = URL.createObjectURL(blob)
            }
        }
    }
}

const deleteStreamFromArray = (strindex: number, index: number) => {
    if (!item.value) return

    if (!episodes.value[index].episode_streams) return

    episodes.value[index].episode_streams.splice(strindex, 1)
}

const createEpisodes = async (i: EpisodeMasslinker[]) => {
    if (!item.value) return

    if (!season.value) return

    const { data, error } = await useAPI<Episode[]>(`/api/episode/mass`, {
        method: 'POST',
        body: i.map((it) => {
            return {
                type: '3rdparty',
                item: item.value ? item.value.id : undefined,
                season: season.value ? season.value.id : undefined,
                name:
                    it.name && it.name.length !== 0
                        ? it.name.map((d) => {
                              return {
                                  locale: d.locale,
                                  name: d.name
                              }
                          })
                        : undefined,
                description:
                    it.description && it.description.length !== 0
                        ? it.description.map((d) => {
                              return {
                                  locale: d.locale,
                                  description: d.description
                              }
                          })
                        : undefined,
                episode_number: it.episode_number && typeof it.episode_number === 'number' ? it.episode_number : parseInt(String(it.episode_number)),
                metadata:
                    it.metadata && it.metadata.release_date
                        ? {
                              release_date: it.metadata.release_date
                          }
                        : undefined,
                references:
                    it.references && it.references.length !== 0
                        ? it.references.map((r) => {
                              return {
                                  id: String(r.id),
                                  service: r.service
                              }
                          })
                        : undefined
            }
        })
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        return
    }

    if (!data.value) return

    return data.value
}

const uploadBanner = async (
    it: {
        id: string
        banner: Blob | undefined
    }[]
) => {
    if (!item.value) return

    const formdata = new FormData()

    for (const i of it) {
        if (i.banner) {
            const mimeType = i.banner.type
            const extension = mimeType.split('/')[1]
            const fileFromUrl = new File([i.banner], `cover.${extension}`, {
                type: mimeType
            })
            formdata.append(i.id, fileFromUrl)
        }
    }

    const { error } = await useAPI(`/api/episode/upload/banners`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const createStreams = async (
    streams: {
        id?: string
        hoster: string | undefined
        item?: string
        season?: string
        episode: string
        type: 'sub' | 'dub'
        locale?: string
        video_id: string | undefined
    }[]
) => {
    if (!item.value) return

    if (!season.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/stream/mass`, {
        method: 'POST',
        body: streams.map((s) => {
            return {
                hoster: s.hoster,
                item: item.value ? item.value.id : undefined,
                season: season.value ? season.value.id : undefined,
                episode: s.episode,
                type: s.type,
                locale: s.locale,
                video_id: s.video_id
            }
        })
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        return
    }

    if (!data.value) return

    return data.value.id
}

const createStream = async (
    stream: {
        id?: string
        hoster: string | undefined
        item?: string
        season?: string
        episode?: string
        type: 'sub' | 'dub'
        locale?: string
        video_id: string | undefined
    },
    i: string
) => {
    if (!item.value) return

    if (!season.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/stream/`, {
        method: 'POST',
        body: {
            hoster: stream.hoster,
            item: item.value ? item.value.id : undefined,
            season: season.value ? season.value.id : undefined,
            episode: i,
            type: stream.type,
            locale: stream.locale,
            video_id: stream.video_id
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false
        return
    }

    if (!data.value) return

    return data.value.id
}

const massUpload = async () => {
    if (!episodes.value) return

    addToast({
        title: 'Mass Upload gestartet!',
        description: 'Der Upload ist gestartet, bitte warten!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = true

    var ep: Episode[] | undefined

    if (episodes.value.filter((i) => !i.id) && episodes.value.filter((i) => !i.id).length !== 0) {
        ep = await createEpisodes(episodes.value.filter((i) => !i.id))
    }

    var cleanepisodes: {
        id: string
        banner: Blob | undefined
        streams:
            | {
                  id?: string
                  hoster: string | undefined
                  item?: string
                  season?: string
                  episode: string
                  type: 'sub' | 'dub'
                  locale?: string
                  video_id: string | undefined
              }[]
            | undefined
    }[] = []

    for (const e of episodes.value.filter((i) => i.id)) {
        if (e.id && e.episode_streams) {
            for (const st of e.episode_streams) {
                if (!st.id) {
                    await createStream(st, e.id)
                }
            }
        }
    }

    if (ep) {
        for (const [i, e] of ep.entries()) {
            const c = episodes.value.filter((i) => !i.id)

            const it = c[i]

            cleanepisodes.push({
                id: e.id,
                banner: it.bannerBlob,
                streams: it.episode_streams
                    ? it.episode_streams.map((stream) => ({
                          ...stream,
                          episode: e.id
                      }))
                    : undefined
            })
        }

        const streams = cleanepisodes.flatMap((e) => e.streams ?? []).filter(Boolean)

        if (streams.length > 0) {
            await createStreams(streams)
        }

        if (cleanepisodes) {
            await uploadBanner(cleanepisodes)
        }
    }

    addToast({
        title: 'Erfolgreich!',
        description: 'Erfolgreich alle Episoden erstellt!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo(`/anime/${route.params.id}/seasons/${route.params.season}/episodes`)
}

if (userdata.value) {
    fetchItem()
    fetchSeason()
    fetchHoster()
    fetchEpisodes()
}
</script>

<style></style>
