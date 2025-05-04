<template>
    <div v-if="item" class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink to="/animes" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <NuxtLink
                :to="`/anime/${route.params.id}/seasons`"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="carbon:next-filled" class="h-3 w-3" />
                Staffeln
            </NuxtLink>
            <button
                @click="deleteItem()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="isAddDataAnimeActive = true"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
            >
                <Icon name="mdi:import" class="h-3 w-3" />
                Import
            </button>
            <button
                @click="changeItem()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
                :disabled="!item.name || !item.scene || !item.name || item.name.length === 0"
            >
                <Icon v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ !item.name || !item.scene || !item.name || item.name.length === 0 ? 'Fülle zuerst die Felder aus' : isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Banner</div>
                <div @click="openFileInputBanner()" class="h-[250px] w-[400px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedBanner && !item.images?.banner" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedBanner" alt="Image" class="h-full w-full object-cover rounded" :src="selectedBanner" />
                    <img
                        v-if="!selectedBanner && item.images && item.images.banner"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${item.images.banner.find((i) => i.height === 450 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" ref="fileInputBanner" @change="handleFileUploadBanner" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Cover</div>
                <div @click="openFileInputCover()" class="h-[300px] w-[200px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedCover && !item.images?.cover" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedCover" alt="Image" class="h-full w-full object-cover rounded" :src="selectedCover" />
                    <img
                        v-if="!selectedCover && item.images && item.images.cover"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${item.images.cover.find((i) => i.height === 600 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" ref="fileInputCover" @change="handleFileUploadCover" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Aktiv</div>
                <select v-model="item.active" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option :value="true">Aktiv</option>
                    <option :value="false">Inaktiv</option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Type</div>
                <select v-model="item.type" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="series">Series</option>
                    <option value="ova">OVA</option>
                    <option value="ona">ONA</option>
                    <option value="movie">Movie</option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Scene</div>
                <select v-model="item.scene" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="anime">Anime</option>
                    <option value="hentai">Hentai</option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <div class="flex flex-col gap-2">
                    <div v-for="n in item.name" class="relative w-full flex flex-row gap-2 max-w-xl">
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
                <div class="text-base w-48">Alternative Names</div>
                <div class="flex flex-col gap-2">
                    <div v-for="(name, index) in item.alternative_names" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <input
                            v-model="item.alternative_names[index]"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Name"
                        />
                        <button @click="deleteAlternativeNameFromArray(name)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="material-symbols:delete" class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="relative w-full flex flex-row gap-2 max-w-xl">
                        <input
                            v-model="dummyAlternativeName"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Name"
                        />
                        <button @click="addDummyAlternativeNameToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Release</div>
                <input
                    v-if="item.metadata"
                    type="date"
                    v-model="item.metadata.release_date"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Description</div>
                <div class="flex flex-col gap-2">
                    <div v-for="d in item.description" class="relative w-full flex flex-row gap-2 max-w-2xl">
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
                <div class="text-base w-48">Kategorien</div>
                <div class="flex flex-col gap-2">
                    <div class="w-[500px] bg-[var(--tertiary)] flex flex-wrap gap-2 rounded-xl p-3">
                        <button v-for="(c, index) in selectedCategories" @click="removeFromSelectedCategory(index)" class="text-xs h-8 p-2 bg-[var(--secondary)] rounded-lg">
                            {{ c.name[0].name }} - {{ c.type }}
                        </button>
                        <div class="relative">
                            <input v-model="catSearch" type="text" class="h-8 bg-transparent outline-none" placeholder="Suchen" />
                            <div
                                v-if="catSearch"
                                class="absolute top-full left-0 h-24 overflow-y-scroll w-full z-10 rounded-lg bg-[var(--secondary)] border-2 border-white border-opacity-10 flex flex-col"
                            >
                                <button
                                    v-for="(ca, i) in categories"
                                    @click="addToSelectedCategory(i)"
                                    class="text-xs p-2 hover:bg-[var(--main)]"
                                    :class="selectedCategories?.find((s) => s.id === ca.id) ? 'hidden' : ''"
                                >
                                    {{ ca.name[0].name }} - {{ ca.type }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">References</div>
                <div class="flex flex-col gap-2">
                    <div v-for="r in item.references" class="relative w-full flex flex-row gap-2 max-w-xl">
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
        </div>
        <AnimeDataImport
            @selectNames="(d) => item?.name.push(...d)"
            @selectAlternativeNames="(d) => item?.alternative_names?.push(...d)"
            @selectDescriptions="(d) => item?.description?.push(...d)"
            @selectReleaseDate="(d) => selectReleaseDate(d)"
            @setReference="(d) => item?.references?.push(d)"
            @selectBanner="(d) => selectBanner(d)"
            @selectCover="(d) => selectCover(d)"
            @selectCategories="(d) => addCategories(d)"
        />
    </div>
</template>

<script lang="ts" setup>
import type { Item, ItemCreate } from '~/components/types/items'
import type { Userdata } from '~/components/types/userdata'
import { useToast } from '@/plugins/useToast'
import type { Category } from '~/components/types/categories'
const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const config = useRuntimeConfig()

const isLoading = ref(false)
const selectedBanner = ref()
const selectedCover = ref()
const selectedBannerBlob = ref()
const selectedCoverBlob = ref()
const fileInputBanner = ref()
const fileInputCover = ref()

const isAddDataAnimeActive = useState<boolean>('isAddDataAnimeActive', () => false)

const categories = ref<Category[]>()

const selectedCategories = ref<Category[]>()

const catSearch = ref<string>()

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

const dummyAlternativeName = ref<string>()

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
    url?: string
}>({
    service: 'crunchyroll',
    id: '',
    url: undefined
})

const openFileInputBanner = () => {
    fileInputBanner.value.click()
}

const openFileInputCover = () => {
    fileInputCover.value.click()
}

const addDummyNameToArray = () => {
    if (!dummyName.value) return

    if (!item.value) return

    item.value.name.push(dummyName.value)

    dummyName.value = {
        locale: 'de-DE',
        name: ''
    }
}

const addDummyAlternativeNameToArray = () => {
    if (!dummyAlternativeName.value) return

    if (!item.value) return

    item.value.alternative_names.push(dummyAlternativeName.value)

    dummyAlternativeName.value = ''
}

const addDummyDescriptionToArray = () => {
    if (!dummyDescription.value) return

    if (!item.value) return

    if (!item.value.description) {
        item.value.description = []
    }

    item.value.description.push(dummyDescription.value)

    dummyDescription.value = {
        locale: 'de-DE',
        description: ''
    }
}

const addDummyReferenceToArray = () => {
    if (!dummyReference.value) return

    if (!item.value) return

    if (!item.value.references) {
        item.value.references = []
    }

    item.value.references.push(dummyReference.value)

    dummyReference.value = {
        service: 'crunchyroll',
        id: '',
        url: undefined
    }
}

const deleteNameFromArray = (name: { locale: string; name: string }) => {
    if (!item.value) return

    const index = item.value.name.findIndex((i) => i === name)

    if (index !== -1) {
        item.value.name.splice(index, 1)
    }
}

const deleteAlternativeNameFromArray = (name: string) => {
    if (!item.value) return

    const index = item.value.alternative_names.findIndex((i) => i === name)

    if (index !== -1) {
        item.value.alternative_names.splice(index, 1)
    }
}

const deleteDescriptionFromArray = (description: { locale: string; description: string }) => {
    if (!item.value || !item.value.description) return

    const index = item.value.description.findIndex((i) => i === description)

    if (index !== -1) {
        item.value.description.splice(index, 1)
    }
}

const deleteReferenceFromArray = (reference: { service: string; id: string; offset?: number; url?: string }) => {
    if (!item.value || !item.value.references) return

    const index = item.value.references.findIndex((i) => i === reference)

    if (index !== -1) {
        item.value.references.splice(index, 1)
    }
}

const handleFileUploadCover = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        selectedCoverBlob.value = file
        selectedCover.value = URL.createObjectURL(file)
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

const selectBanner = async (imageUrl: string) => {
    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        selectedBannerBlob.value = blob
        selectedBanner.value = URL.createObjectURL(blob)
    } catch (error) {
        console.error('Failed to load image:', error)
    }
}

const selectCover = async (imageUrl: string) => {
    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        selectedCoverBlob.value = blob
        selectedCover.value = URL.createObjectURL(blob)
    } catch (error) {
        console.error('Failed to load image:', error)
    }
}

const selectReleaseDate = async (releaseDate: Date) => {
    if (!item.value) return

    const date = new Date(releaseDate)

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    item.value.metadata.release_date = `${year}-${month}-${day}`
}

const item = ref<Item>()

const changeItem = async () => {
    isLoading.value = true

    if (!item.value) return

    var date: string | undefined

    if (item.value.metadata && item.value.metadata.release_date) {
        date = new Date(item.value.metadata.release_date).toISOString()
    }

    const { data, error } = await useAPI(`/api/item/`, {
        method: 'PUT',
        body: {
            id: item.value.id,
            active: item.value.active,
            type: item.value.type,
            scene: item.value.scene,
            name: item.value.name
                ? item.value.name.map((d) => {
                      return {
                          locale: d.locale,
                          name: d.name
                      }
                  })
                : undefined,
            alternative_names: item.value.alternative_names && item.value.alternative_names.length !== 0 ? item.value.alternative_names : undefined,
            description:
                item.value.description && item.value.description.length !== 0
                    ? item.value.description.map((d) => {
                          return {
                              locale: d.locale,
                              description: d.description
                          }
                      })
                    : undefined,
            metadata:
                item.value.metadata && date
                    ? {
                          release_date: date
                      }
                    : undefined,
            references: item.value.references && item.value.references.length !== 0 ? item.value.references : undefined,
            categories: selectedCategories.value && selectedCategories.value.length !== 0 ? selectedCategories.value.map((i) => i.id) : undefined
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

    if (selectedBannerBlob.value) {
        await uploadBanner()
    }

    if (selectedCoverBlob.value) {
        await uploadCover()
    }

    isLoading.value = false

    addToast({
        title: 'Gespeichert',
        description: 'Anime gespeichert!',
        timeout: 5000,
        color: '#2d9124'
    })

    if (!data.value) return
}

const uploadBanner = async () => {
    if (!item.value) return

    const formdata = new FormData()

    if (selectedBannerBlob.value) {
        const mimeType = selectedBannerBlob.value.type
        const extension = mimeType.split('/')[1]
        const fileFromUrl = new File([selectedBannerBlob.value], `cover.${extension}`, { type: mimeType })
        formdata.append(item.value.id, fileFromUrl)
    } else {
        return
    }

    const { error } = await useAPI(`/api/item/upload/banner`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const uploadCover = async () => {
    if (!item.value) return

    const formdata = new FormData()

    if (selectedCoverBlob.value) {
        const mimeType = selectedCoverBlob.value.type
        const extension = mimeType.split('/')[1]
        const fileFromUrl = new File([selectedCoverBlob.value], `cover.${extension}`, { type: mimeType })
        formdata.append(item.value.id, fileFromUrl)
    } else {
        return
    }

    const { error } = await useAPI(`/api/item/upload/cover`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const fetchItem = async () => {
    const { data, error } = await useAPI<Item>(`/api/item/admin/${route.params.id}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value.alternative_names) {
        data.value.alternative_names = []
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

    if (data.value.categories) {
        selectedCategories.value = data.value.categories
    }

    item.value = data.value
}

const addCategories = (cat: Category[]) => {
    if (!categories.value) return

    if (!selectedCategories.value) {
        selectedCategories.value = []
    }

    for (const c of cat) {
        if (!selectedCategories.value.find((s) => s.id === c.id)) {
            selectedCategories.value.push(c)
        }
    }
}

const fetchCategories = async () => {
    const { data, error } = await useAPI<Category[]>(`/api/category/admin`, {
        method: 'GET',
        query: {
            search: catSearch.value
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    categories.value = data.value
}

const addToSelectedCategory = async (index: number) => {
    if (!categories.value) return

    if (!selectedCategories.value) {
        selectedCategories.value = []
    }

    selectedCategories.value.push(categories.value[index])

    catSearch.value = ''
}

const removeFromSelectedCategory = async (index: number) => {
    if (!selectedCategories.value) return

    selectedCategories.value.splice(index, 1)
}

watch(catSearch, () => {
    fetchCategories()
})

const deleteItem = async () => {
    isLoading.value = true

    if (!item.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/item/${item.value.id}`, {
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
        description: 'Item gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo(`/animes`)
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchItem()
    fetchCategories()
}
</script>

<style></style>
