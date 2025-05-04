<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm justify-between">
            <NuxtLink to="/hosters" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="createHoster()"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
                :disabled="!hoster.name || !hoster.domains || hoster.domains.length === 0 || !hoster.embed_path"
            >
                <Icon v-if="!isLoading" name="material-symbols:save-sharp" class="h-3 w-3" />
                <Icon v-if="isLoading" name="mingcute:loading-3-fill" class="h-3 w-3 animate-spin" />
                {{ !hoster.name || !hoster.domains || hoster.domains.length === 0 || !hoster.embed_path ? 'Fülle zuerst die Felder aus' : isLoading ? 'Erstelle' : 'Erstellen' }}
            </button>
        </div>
        <div class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Bild</div>
                <div @click="openFileInputImage()" class="h-[100px] w-[100px] flex items-center justify-center bg-[var(--tertiary)] rounded-xl cursor-pointer">
                    <Icon v-if="!selectedImage" name="material-symbols:upload" class="h-10 w-10" />
                    <img v-if="selectedImage" alt="Image" class="h-full w-full object-cover rounded" :src="selectedImage" />
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
                    <div v-for="(n, index) in hoster.domains" class="relative w-full flex flex-row gap-2 max-w-xl">
                        <input
                            v-model="hoster.domains[index]"
                            class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                            type="text"
                            placeholder="Domain / voe.sx"
                        />
                        <button @click="deleteHosterFromArray(index)" class="flex items-center justify-center text-white bg-[var(--tertiary)] w-20 h-10 rounded-xl">
                            <Icon name="material-symbols:delete" class="h-4 w-4" />
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
                            <Icon name="ic:baseline-plus" class="h-4 w-4" />
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
import type { HosterCreate } from '~/components/types/hosters'

definePageMeta({
    layout: 'admin'
})

const isLoading = ref(false)
const selectedImage = ref()
const fileInputImage = ref()

const { addToast } = useToast()

const dummyHoster = ref<string>()

const openFileInputImage = () => {
    fileInputImage.value.click()
}

const addDummyHosterToArray = () => {
    if (!dummyHoster.value) return

    hoster.value.domains.push(dummyHoster.value)

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

const hoster = ref<HosterCreate>({
    name: '',
    domains: [],
    embed_path: ''
})

const createHoster = async () => {
    isLoading.value = true

    if (!hoster.value) return

    if (!fileInputImage.value.files[0]) return

    const { data, error } = await useAPI<{
        id: string
    }>(`/api/hoster/`, {
        method: 'POST',
        body: {
            name: hoster.value.name,
            domains: hoster.value.domains,
            embed_path: hoster.value.embed_path
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

    if (fileInputImage.value.files[0]) {
        await uploadImage(data.value.id)
    }

    isLoading.value = false

    navigateTo(`/hoster/${data.value.id}`)

    addToast({
        title: 'Erstellt',
        description: 'Hoster erstellt!',
        timeout: 5000,
        color: '#2d9124'
    })
}

const uploadImage = async (id: string) => {
    if (!hoster.value) return

    const formdata = new FormData()

    if (fileInputImage.value.files[0]) {
        const image = fileInputImage.value.files[0]
        formdata.append(id, image)
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
</script>

<style></style>
