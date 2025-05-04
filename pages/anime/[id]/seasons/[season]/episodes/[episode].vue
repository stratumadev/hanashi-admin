<template>
    <div v-if="episode" class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="deleteEpisode()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="changeItem()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Banner</div>
                <div @click="openFileInputBanner()" class="h-[250px] w-[400px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedBanner && !episode.images?.banner" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedBanner" alt="Image" class="h-full w-full object-cover rounded" :src="selectedBanner" />
                    <img
                        v-if="!selectedBanner && episode.images && episode.images.banner"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${episode.images.banner.find((i) => i.height === 450 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" ref="fileInputBanner" @change="handleFileUploadBanner" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <div class="flex flex-col gap-2">
                    <div v-for="n in episode.name" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="n.locale" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <input v-model="n.name" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Name" />
                        <button @click="deleteNameFromArray(n)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="material-symbols:delete" class="h-4 w-4" />
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
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Description</div>
                <div class="flex flex-col gap-2">
                    <div v-for="d in episode.description" class="relative w-full flex flex-row gap-2 max-w-2xl">
                        <select v-model="d.locale" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <textarea
                            v-model="d.description"
                            class="w-[500px] h-24 px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Description"
                        />
                        <button @click="deleteDescriptionFromArray(d)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="material-symbols:delete" class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="relative w-full flex flex-row gap-2 max-w-2xl">
                        <select v-model="dummyDescription.locale" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <textarea
                            v-model="dummyDescription.description"
                            class="w-[500px] h-24 px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Description"
                        />
                        <button @click="addDummyDescriptionToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Episode Number</div>
                <input
                    type="text"
                    v-model="episode.episode_number"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="Season Number"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Release</div>
                <input
                    type="date"
                    v-model="episode.metadata.release_date"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">References</div>
                <div class="flex flex-col gap-2">
                    <div v-for="r in episode.references" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="r.service" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="s in services" :value="s.system_name">
                                {{ s.name }}
                            </option>
                        </select>
                        <input v-model="r.id" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="ID" />
                        <button @click="deleteReferenceFromArray(r)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="material-symbols:delete" class="h-4 w-4" />
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
                        <button @click="addDummyReferenceToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Streams</div>
                <div class="flex flex-col gap-3">
                    <button
                        v-if="episode.episode_streams && episode.episode_streams.length === 0"
                        @click="addDummyStreamToArray()"
                        class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                    >
                        <Icon name="ic:baseline-plus" class="h-4 w-4" />
                    </button>
                    <div v-for="(d, i) in episode.episode_streams" class="relative w-full flex flex-col gap-2 max-w-xs">
                        <div class="flex justify-between">
                            <div v-if="d.status" class="text-sm capitalize" :class="d.status !== 'online' ? 'text-red-600' : 'text-green-400'">
                                {{ d.status === 'online' ? 'Online' : 'TOT' }}
                            </div>

                            <div v-if="d.stream_backupstream && d.stream_backupstream.status === 'online'" class="text-sm capitalize text-green-400"> Backup verfügbar </div>
                            <div v-if="d.stream_backupstream && d.stream_backupstream.status !== 'online'" class="text-sm capitalize text-red-600"> Backup tot </div>
                            <div v-if="!d.stream_backupstream" class="text-sm capitalize text-red-600"> Kein Backup </div>
                        </div>
                        <select v-model="d.hoster" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in hoster" :value="l.id">
                                {{ l.name }}
                            </option>
                        </select>
                        <select v-model="d.locale" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="l in languages" :value="l.iso">
                                {{ l.name }}
                            </option>
                        </select>
                        <select v-model="d.type" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option value="sub">Sub</option>
                            <option value="dub">Dub</option>
                        </select>
                        <input
                            v-model="d.video_id"
                            class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Video ID"
                        />
                        <div class="flex flex-row justify-between gap-3">
                            <button
                                v-if="episode.episode_streams && episode.episode_streams.length === i + 1"
                                @click="addDummyStreamToArray()"
                                class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                            >
                                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                            </button>
                            <button @click="d.id ? editStream(d) : createStream(d)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                                <Icon name="material-symbols:save" class="h-4 w-4" />
                            </button>
                            <button
                                @click="d.id ? deleteStream(d.id) : deleteStreamFromArray(i)"
                                class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl"
                            >
                                <Icon name="material-symbols:delete" class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Userdata } from '~/components/types/userdata'
import { useToast } from '@/plugins/useToast'
import type { Episode } from '~/components/types/episodes'
import type { Hoster } from '~/components/types/hosters'
const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const config = useRuntimeConfig()

const isLoading = ref(false)
const selectedBanner = ref()
const selectedBannerBlob = ref()
const fileInputBanner = ref()

const hoster = ref<Hoster[]>()

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

const dummyDescription = ref<{
    locale: string
    description: string
}>({
    locale: 'de-DE',
    description: ''
})

const dummyReference = ref<{
    service: string
    id: string
    offset?: number
    season_number?: number
}>({
    service: 'crunchyroll',
    id: ''
})

const addDummyStreamToArray = () => {
    if (!episode.value) return

    if (!hoster.value) return

    if (!episode.value.episode_streams) {
        episode.value.episode_streams = []
    }

    episode.value.episode_streams.push({
        hoster: hoster.value[0].id,
        locale: 'de-DE',
        type: 'sub',
        video_id: ''
    })
}

const deleteStreamFromArray = (index: number) => {
    if (!episode.value) return

    if (!episode.value.episode_streams) return

    episode.value.episode_streams.splice(index, 1)
}

const openFileInputBanner = () => {
    fileInputBanner.value.click()
}

const addDummyNameToArray = () => {
    if (!dummyName.value) return

    if (!episode.value) return

    episode.value.name.push(dummyName.value)

    dummyName.value = {
        locale: 'de-DE',
        name: ''
    }
}

const addDummyDescriptionToArray = () => {
    if (!dummyDescription.value) return

    if (!episode.value) return

    if (!episode.value.description) {
        episode.value.description = []
    }

    episode.value.description.push(dummyDescription.value)

    dummyDescription.value = {
        locale: 'de-DE',
        description: ''
    }
}

const addDummyReferenceToArray = () => {
    if (!dummyReference.value) return

    if (!episode.value) return

    if (!episode.value.references) {
        episode.value.references = []
    }

    episode.value.references.push(dummyReference.value)

    dummyReference.value = {
        service: 'crunchyroll',
        id: '',
        season_number: undefined
    }
}

const deleteNameFromArray = (name: { locale: string; name: string }) => {
    if (!episode.value) return

    const index = episode.value.name.findIndex((i) => i === name)

    if (index !== -1) {
        episode.value.name.splice(index, 1)
    }
}

const deleteReferenceFromArray = (reference: { service: string; id: string; offset?: number; url?: string }) => {
    if (!episode.value || !episode.value.references) return

    const index = episode.value.references.findIndex((i) => i === reference)

    if (index !== -1) {
        episode.value.references.splice(index, 1)
    }
}

const deleteDescriptionFromArray = (description: { locale: string; description: string }) => {
    if (!episode.value || !episode.value.description) return

    const index = episode.value.description.findIndex((i) => i === description)

    if (index !== -1) {
        episode.value.description.splice(index, 1)
    }
}

const handleFileUploadBanner = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        selectedBannerBlob.value = file
        selectedBanner.value = URL.createObjectURL(file)
    }
}

const episode = ref<Episode>()

const changeItem = async () => {
    isLoading.value = true

    if (!episode.value) return

    const { data, error } = await useAPI(`/api/episode/`, {
        method: 'PUT',
        body: {
            id: episode.value.id,
            type: '3rdparty',
            name:
                episode.value.name && episode.value.name.length !== 0
                    ? episode.value.name.map((d) => {
                          return {
                              locale: d.locale,
                              name: d.name
                          }
                      })
                    : undefined,
            description:
                episode.value.description && episode.value.description.length !== 0
                    ? episode.value.description.map((d) => {
                          return {
                              locale: d.locale,
                              description: d.description
                          }
                      })
                    : undefined,
            episode_number:
                episode.value.episode_number && typeof episode.value.episode_number === 'number' ? episode.value.episode_number : parseInt(String(episode.value.episode_number)),
            metadata:
                episode.value.metadata && episode.value.metadata.release_date
                    ? {
                          release_date: episode.value.metadata.release_date
                      }
                    : undefined,
            references:
                episode.value.references && episode.value.references.length !== 0
                    ? episode.value.references.map((r) => {
                          return {
                              id: String(r.id),
                              service: r.service
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

    if (selectedBannerBlob.value) {
        await uploadBanner(episode.value.id)
    }

    isLoading.value = false

    if (!data.value) return
}

const uploadBanner = async (id: string) => {
    if (!selectedBannerBlob.value) return

    const formdata = new FormData()

    const mimeType = selectedBannerBlob.value.type
    const extension = mimeType.split('/')[1]
    const fileFromUrl = new File([selectedBannerBlob.value], `cover.${extension}`, { type: mimeType })

    formdata.append(id, fileFromUrl)

    const { error } = await useAPI(`/api/episode/upload/banners`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const fetchEpisode = async () => {
    const { data, error } = await useAPI<Episode>(`/api/episode/admin/${route.params.episode}`, {
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

    episode.value = data.value
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

const deleteEpisode = async () => {
    isLoading.value = true

    if (!episode.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/episode/${episode.value.id}`, {
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
        description: 'Episode gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo(`/anime/${route.params.id}/seasons/${route.params.season}/episodes`)
}

const createStream = async (stream: {
    id?: string
    hoster: string | undefined
    item?: string
    season?: string
    episode?: string
    type: 'sub' | 'dub'
    locale?: string
    video_id: string | undefined
}) => {
    if (!episode.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/stream/`, {
        method: 'POST',
        body: {
            hoster: stream.hoster,
            item: episode.value ? episode.value.item : undefined,
            season: episode.value ? episode.value.season : undefined,
            episode: episode.value.id,
            type: stream.type,
            locale: stream.locale,
            video_id: stream.video_id
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false

        addToast({
            title: 'Fehler',
            description: 'Konnte nicht erstellt werden!',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }

    addToast({
        title: 'Erstellt!',
        description: 'Stream wurde erfolgreich erstellt!',
        timeout: 5000,
        color: '#2d9124'
    })

    await fetchEpisode()
}

const editStream = async (stream: {
    id?: string
    hoster: string | undefined
    item?: string
    season?: string
    episode?: string
    type: 'sub' | 'dub'
    locale?: string
    video_id: string | undefined
}) => {
    if (!episode.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/stream/`, {
        method: 'PUT',
        body: {
            id: stream.id,
            hoster: stream.hoster,
            item: episode.value ? episode.value.item : undefined,
            season: episode.value ? episode.value.season : undefined,
            episode: episode.value.id,
            type: stream.type,
            locale: stream.locale,
            video_id: stream.video_id
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
        title: 'Gespeichert!',
        description: 'Stream wurde erfolgreich gespeichert!',
        timeout: 5000,
        color: '#2d9124'
    })

    await fetchEpisode()
}

const deleteStream = async (stream_id: string) => {
    isLoading.value = true

    const { error } = await useAPI<{
        id: string
    }>(`/api/stream/${stream_id}`, {
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
        description: 'Stream gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    await fetchEpisode()
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    await fetchEpisode()
    await fetchHoster()
}
</script>

<style></style>
