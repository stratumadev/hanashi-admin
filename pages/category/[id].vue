<template>
    <div v-if="category" class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm gap-3">
            <NuxtLink to="/categories" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="deleteCategory()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="editCategory()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
                :disabled="!category.name || !category.scene || !category.name || category.name.length === 0"
            >
                <Icon v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ !category.name || !category.scene || !category.name || category.name.length === 0 ? 'Fülle zuerst die Felder aus' : isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Banner</div>
                <div @click="openFileInputBanner()" class="h-[250px] w-[400px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedBanner && !category.images?.banner" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedBanner" alt="Image" class="h-full w-full object-cover rounded" :src="selectedBanner" />
                    <img
                        v-if="!selectedBanner && category.images && category.images.banner"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${category.images.banner.find((i) => i.height === 450 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" ref="fileInputBanner" @change="handleFileUploadBanner" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Cover</div>
                <div @click="openFileInputCover()" class="h-[300px] w-[200px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedCover && !category.images?.cover" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedCover" alt="Image" class="h-full w-full object-cover rounded" :src="selectedCover" />
                    <img
                        v-if="!selectedCover && category.images && category.images.cover"
                        alt="Image"
                        class="h-full w-full object-cover rounded"
                        :src="`${config.public.origincdn}/public/${category.images.cover.find((i) => i.height === 600 && i.format === 'avif')?.source}`"
                    />
                </div>
                <input type="file" ref="fileInputCover" @change="handleFileUploadCover" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Type</div>
                <select v-model="category.type" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="main-genre">Main Genre</option>
                    <option value="secondary-genre">Secondary Genre</option>
                    <option value="tag">Tag</option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Scene</div>
                <select v-model="category.scene" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="anime">Anime</option>
                    <option value="hentai">Hentai</option>
                </select>
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <div class="flex flex-col gap-2">
                    <div v-for="n in category.name" class="relative w-full flex flex-row gap-2 max-w-xl">
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
                    <div v-for="d in category.description" class="relative w-full flex flex-row gap-2 max-w-2xl">
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
                <div class="text-base w-48">References</div>
                <div class="flex flex-col gap-2">
                    <div v-for="r in category.references" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <select v-model="r.service" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                            <option v-for="s in services" :value="s.system_name">
                                {{ s.name }}
                            </option>
                        </select>
                        <input v-model="r.name" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Name" />
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
                            v-model="dummyReference.name"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Name"
                        />
                        <button @click="addDummyReferenceToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Category, CategoryCreate } from '~/components/types/categories'
import { useToast } from '@/plugins/useToast'
import type { Userdata } from '~/components/types/userdata'

definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()

const { addToast } = useToast()

const isLoading = ref(false)
const selectedBanner = ref()
const selectedCover = ref()
const fileInputBanner = ref()
const fileInputCover = ref()
const route = useRoute()

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
    name: string
}>({
    service: 'crunchyroll',
    name: ''
})

const openFileInputBanner = () => {
    fileInputBanner.value.click()
}

const openFileInputCover = () => {
    fileInputCover.value.click()
}

const addDummyNameToArray = () => {
    if (!dummyName.value) return

    if (!category.value) return

    category.value.name.push(dummyName.value)

    dummyName.value = {
        locale: 'de-DE',
        name: ''
    }
}

const addDummyDescriptionToArray = () => {
    if (!dummyDescription.value) return

    if (!category.value) return

    if (!category.value.description) {
        category.value.description = []
    }

    category.value.description.push(dummyDescription.value)

    dummyDescription.value = {
        locale: 'de-DE',
        description: ''
    }
}

const addDummyReferenceToArray = () => {
    if (!dummyReference.value) return

    if (!category.value) return

    if (!category.value.references) {
        category.value.references = []
    }

    category.value.references.push(dummyReference.value)

    dummyReference.value = {
        service: 'crunchyroll',
        name: ''
    }
}

const deleteNameFromArray = (name: { locale: string; name: string }) => {
    if (!category.value) return

    const index = category.value.name.findIndex((i) => i === name)

    if (index !== -1) {
        category.value.name.splice(index, 1)
    }
}

const deleteDescriptionFromArray = (description: { locale: string; description: string }) => {
    if (!category.value || !category.value.description) return

    const index = category.value.description.findIndex((i) => i === description)

    if (index !== -1) {
        category.value.description.splice(index, 1)
    }
}

const deleteReferenceFromArray = (reference: { service: string; name: string; url?: string }) => {
    if (!category.value || !category.value.references) return

    const index = category.value.references.findIndex((i) => i === reference)

    if (index !== -1) {
        category.value.references.splice(index, 1)
    }
}

const handleFileUploadCover = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        selectedCover.value = URL.createObjectURL(file)
    }
}

const handleFileUploadBanner = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        selectedBanner.value = URL.createObjectURL(file)
    }
}

const category = ref<Category>()

const fetchCategory = async () => {
    const { data, error } = await useAPI<Category>(`/api/category/admin/${route.params.id}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    category.value = data.value
}

const editCategory = async () => {
    isLoading.value = true

    if (!category.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/category/`, {
        method: 'PUT',
        body: {
            id: category.value.id,
            type: category.value.type,
            scene: category.value.scene,
            name: category.value.name,
            description: category.value.description && category.value.description.length !== 0 ? category.value.description : undefined,
            references: category.value.references && category.value.references.length !== 0 ? category.value.references : undefined
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        isLoading.value = false

        addToast({
            title: 'Fehler',
            description: 'Änderungen nicht gespeichert',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }

    if (fileInputBanner.value.files[0]) {
        await uploadBanner()
    }

    if (fileInputCover.value.files[0]) {
        await uploadCover()
    }

    addToast({
        title: 'Gespeichert',
        description: 'Änderungen gespeichert',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false
}

const uploadBanner = async () => {
    if (!category.value) return

    const formdata = new FormData()

    if (fileInputBanner.value.files[0]) {
        const image = fileInputBanner.value.files[0]
        formdata.append(category.value.id, image)
    } else {
        return
    }

    const { error } = await useAPI(`/api/category/upload/banner`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const uploadCover = async () => {
    if (!category.value) return

    const formdata = new FormData()

    if (fileInputCover.value.files[0]) {
        const image = fileInputCover.value.files[0]
        formdata.append(category.value.id, image)
    } else {
        return
    }

    const { error } = await useAPI(`/api/category/upload/cover`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const deleteCategory = async () => {
    isLoading.value = true

    if (!category.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/category/${category.value.id}`, {
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
        description: 'Kategorie gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo('/categories')
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchCategory()
}
</script>

<style></style>
