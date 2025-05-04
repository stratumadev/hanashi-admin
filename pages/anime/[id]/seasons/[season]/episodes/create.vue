<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons/${route.params.season}/episodes`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
            >
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="createEpisode()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Banner</div>
                <div @click="openFileInputBanner()" class="h-[250px] w-[400px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon mode="svg" v-if="!selectedBanner" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedBanner" alt="Image" class="h-full w-full object-cover rounded" :src="selectedBanner" />
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
                            <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
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
                            <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
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
                        <button @click="addDummyReferenceToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Userdata } from '~/components/types/userdata'
import { useToast } from '@/plugins/useToast'
import type { Episode, EpisodeCreate } from '~/components/types/episodes'
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

const episode = ref<EpisodeCreate>({
    type: '3rdparty',
    item: '',
    season: '',
    name: [],
    description: [],
    episode_number: 0,
    metadata: {
        release_date: undefined
    },
    references: []
})

const createEpisode = async () => {
    isLoading.value = true

    if (!episode.value || !route || !route.params || !route.params.id || !route.params.season) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/episode/`, {
        method: 'POST',
        body: {
            type: '3rdparty',
            item: route.params.id,
            season: route.params.season,
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

    isLoading.value = false

    if (!data.value) return

    if (selectedBannerBlob.value) {
        await uploadBanner(data.value.id)
    }

    navigateTo(`/anime/${route.params.id}/seasons/${route.params.season}/episodes/${data.value.id}`)
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

const userdata = useState<Userdata | null>('userdata', () => null)
</script>

<style></style>
