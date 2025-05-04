<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm justify-end">
            <NuxtLink to="/hoster/create" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"></div>
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Domain </div>
            </div>
            <div v-if="hosters && !isFetching" class="flex flex-col gap-3">
                <div
                    v-for="(hoster, i) in hosters"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                >
                    <div class="flex-1 flex flex-row items-center justify-center h-full gap-2">
                        <button
                            v-if="hosters[i - 1]"
                            @click="switchHosters(hoster.id, hosters[i - 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowup" class="h-4 w-4" />
                        </button>
                        <button
                            v-if="hosters[i + 1]"
                            @click="switchHosters(hoster.id, hosters[i + 1].id)"
                            class="px-3 py-2 bg-[var(--main)] rounded-xl flex items-center justify-center"
                        >
                            <Icon name="raphael:arrowdown" class="h-4 w-4" />
                        </button>
                    </div>
                    <NuxtLink :to="`/hoster/${hoster.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ hoster.name }}
                    </NuxtLink>
                    <NuxtLink :to="`/hoster/${hoster.id}`" class="text-sm flex-1 flex justify-center items-center">
                        {{ hoster.domains[0].domain }}
                    </NuxtLink>
                    <NuxtLink :to="`/hoster/${hoster.id}`" class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </NuxtLink>
                </div>
            </div>
            <div v-if="!hosters && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Hoster } from '~/components/types/hosters'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()

const isFetching = ref<boolean>(false)
const hosters = ref<Hoster[]>()

const fetchHosters = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Hoster[]>(`/api/hoster/admin`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    hosters.value = data.value
    isFetching.value = false
}

const switchHosters = async (id: string, id_switch: string) => {
    const { error } = await useAPI<{
        id: string
    }>(`/api/hoster/admin/switch`, {
        method: 'POST',
        body: {
            up: id,
            down: id_switch
        }
    })

    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    await fetchHosters()
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchHosters()
}
</script>

<style></style>
