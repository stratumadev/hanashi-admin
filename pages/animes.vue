<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm items-center">
            <input v-model="search" class="px-3 py-2.5 text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Suche" />
            <!-- <div v-if="items" class="flex flex-col items-center text-xs ml-3">
                <div class="text-xs">{{ items.length }} Animes insgesamt</div>
                <div class="text-xs">
                    {{ items.filter((p) => p.active).length }} Animes aktiv
                </div>
            </div> -->
            <NuxtLink
                to="/anime/create"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"> Banner </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Type </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Scene </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Active </div>
            </div>
            <div v-if="items && !isFetchingFirst" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="(item, index) in items"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/anime/${item.id}`"
                    :id="index === items.length - 1 ? 'last-item' : null"
                >
                    <div v-if="item.images && item.images.cover" class="text-sm flex-1 flex justify-center items-center">
                        <img
                            :src="`${config.public.origincdn}/public/${item.images.cover.find((c) => c.height === 600 && c.format === 'avif')?.source}`"
                            alt=""
                            class="h-24 mx-auto rounded"
                            loading="lazy"
                        />
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center text-center">
                        {{ item.name.find((n) => n.locale === 'de-DE')?.name }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ item.type }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ item.scene }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        <Icon :name="item.active ? 'mdi:eye' : 'mdi:eye-off'" class="h-4 w-4" />
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!items && isFetchingFirst" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/components/types/items'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()

const isFetching = ref<boolean>(false)
const isFetchingFirst = ref<boolean>(true)
const items = ref<Item[]>()
const search = ref<string>()
const isFinish = ref(false)
let offset = ref(0)

const fetchItems = async () => {
    if (isFinish.value || isFetching.value) return

    isFetching.value = true
    const { data, error } = await useAPI<Item[]>(`/api/item/admin`, {
        method: 'GET',
        params: {
            limit: 25,
            offset: offset.value > 0 ? offset : undefined,
            search: search.value
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    if (items.value) {
        items.value = [...items.value, ...data.value]
    } else {
        items.value = data.value
    }

    if (data.value.length === 0) {
        isFinish.value = true
    }
    offset.value += 1

    isFetching.value = false
    isFetchingFirst.value = false
}

let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const handleScroll = () => {
    if (scrollTimeout) return

    scrollTimeout = setTimeout(async () => {
        const lastItem = document.getElementById('last-item')
        if (lastItem) {
            const rect = lastItem.getBoundingClientRect()
            const isAtBottom = rect.top <= window.innerHeight && rect.bottom >= 0

            if (isAtBottom && !isFetching.value && !isFetching.value) {
                await fetchItems()
            }
        }

        scrollTimeout = null
    }, 200)
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

watch(search, () => {
    items.value = []
    offset.value = 0
    isFinish.value = false
    fetchItems()
})

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchItems()
}
</script>

<style></style>
