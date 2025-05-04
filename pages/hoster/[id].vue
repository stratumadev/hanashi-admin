<template>
    <div v-if="hoster" class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm">
            <NuxtLink to="/hosters" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="deleteHoster()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon mode="svg" name="material-symbols:delete" class="h-3 w-3" />
                Löschen
            </button>
            <button
                @click="editHoster()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-3"
                :disabled="!hoster.name || !hoster.domains || hoster.domains.length === 0 || !hoster.embed_path"
            >
                <Icon mode="svg" v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon mode="svg" v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ !hoster.name || !hoster.domains || hoster.domains.length === 0 || !hoster.embed_path ? 'Fülle zuerst die Felder aus' : isLoading ? 'Speichere' : 'Speichern' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Bild</div>
                <div @click="openFileInputImage()" class="h-[100px] w-[100px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon mode="svg" v-if="!selectedImage && !hoster.image" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedImage" alt="Image" class="h-full w-full object-cover rounded" :src="selectedImage" />
                    <img v-if="!selectedImage && hoster.image" alt="Image" class="h-full w-full object-cover rounded" :src="`${config.public.origincdn}/public/${hoster.image}`" />
                </div>
                <input type="file" ref="fileInputImage" @change="handleFileUploadImage" accept="image/png, image/jpeg, image/webp" class="hidden" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <input type="text" v-model="hoster.name" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" placeholder="Name" />
            </div>

            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Embed Path</div>
                <input
                    type="text"
                    v-model="hoster.embed_path"
                    class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    placeholder="/e/"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Domains</div>
                <div class="flex flex-col gap-2">
                    <div v-for="(n, index) in fixedHoster" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <input
                            v-model="fixedHoster[index]"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Domain / voe.sx"
                        />
                        <button @click="deleteHosterFromArray(index)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="material-symbols:delete" class="h-4 w-4" />
                        </button>
                    </div>
                    <div class="relative w-full flex flex-row gap-2 max-w-xl">
                        <input
                            v-model="dummyHoster"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Domain / voe.sx"
                        />
                        <button @click="addDummyHosterToArray()" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { CategoryCreate } from '~/components/types/categories'
import { useToast } from '@/plugins/useToast'
import type { Hoster, HosterCreate } from '~/components/types/hosters'
import type { Userdata } from '~/components/types/userdata'

definePageMeta({
    layout: 'admin'
})

const isLoading = ref(false)
const selectedImage = ref()
const fileInputImage = ref()
const route = useRoute()
const config = useRuntimeConfig()

const { addToast } = useToast()

const dummyHoster = ref<string>()

const fixedHoster = ref<string[]>([])

const openFileInputImage = () => {
    fileInputImage.value.click()
}

const addDummyHosterToArray = () => {
    if (!dummyHoster.value) return

    if (!hoster.value) return

    fixedHoster.value.push(dummyHoster.value)

    dummyHoster.value = ''
}

const deleteHosterFromArray = (index: number) => {
    if (!hoster.value) return

    if (index !== -1) {
        hoster.value.domains.splice(index, 1)
    }
}

const handleFileUploadImage = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    if (inputElement?.files?.length) {
        const file = inputElement.files[0]
        selectedImage.value = URL.createObjectURL(file)
    }
}

const hoster = ref<Hoster>()

const editHoster = async () => {
    isLoading.value = true

    if (!hoster.value) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/hoster/`, {
        method: 'PUT',
        body: {
            id: hoster.value.id,
            name: hoster.value.name,
            domains: fixedHoster.value ? fixedHoster.value : undefined,
            embed_path: hoster.value.embed_path
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

    if (fileInputImage.value.files[0]) {
        await uploadImage()
    }

    isLoading.value = false

    addToast({
        title: 'Gespeichert',
        description: 'Hoster gespeichert!',
        timeout: 5000,
        color: '#2d9124'
    })
}

const uploadImage = async () => {
    if (!hoster.value) return

    const formdata = new FormData()

    if (fileInputImage.value.files[0]) {
        const image = fileInputImage.value.files[0]
        formdata.append(hoster.value.id, image)
    } else {
        return
    }

    const { error } = await useAPI(`/api/hoster/upload/image`, {
        method: 'POST',
        body: formdata
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }
}

const fetchHoster = async () => {
    const { data, error } = await useAPI<Hoster>(`/api/hoster/admin/${route.params.id}`, {
        method: 'GET'
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    hoster.value = data.value

    fixedHoster.value = data.value.domains.map((m) => m.domain)
}

const deleteHoster = async () => {
    isLoading.value = true

    if (!hoster.value) return

    const { error } = await useAPI<{
        id: string
    }>(`/api/hoster/${hoster.value.id}`, {
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
        description: 'Hoster gelöscht!',
        timeout: 5000,
        color: '#2d9124'
    })

    isLoading.value = false

    navigateTo('/hosters')
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchHoster()
}
</script>

<style></style>
