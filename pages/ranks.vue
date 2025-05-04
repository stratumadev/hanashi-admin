<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm justify-end">
            <NuxtLink to="/rank/create" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon mode="svg" name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center"> ID </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Name </div>
            </div>
            <div v-if="ranks && !isFetching" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="rank in ranks"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/rank/${rank.id}`"
                >
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ rank.id }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ rank.name }}
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon mode="svg" name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!ranks && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon mode="svg" name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Rank } from '~/components/types/roles'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const isFetching = ref<boolean>(false)
const ranks = ref<Rank[]>()

const fetchRanks = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<Rank[]>(`/api/rank/`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    ranks.value = data.value
    isFetching.value = false
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchRanks()
}
</script>

<style></style>
