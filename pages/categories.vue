<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm">
            <input v-model="search" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Suche" />
            <NuxtLink
                to="/category/create"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Type </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Scene </div>
            </div>
            <div v-if="categories && !isFetching" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="category in categories"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/category/${category.id}`"
                >
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ category.name[0].name }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ category.type }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ category.scene }}
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!categories && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/components/types/categories'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()

const search = ref<string>()

const isFetching = ref<boolean>(false)
const categories = ref<Category[]>()

const fetchCategories = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Category[]>(`/api/category/admin`, {
        method: 'GET',
        query: {
            search: search.value
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    categories.value = data.value
    isFetching.value = false
}

watch(search, () => {
    fetchCategories()
})

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchCategories()
}
</script>

<style></style>
