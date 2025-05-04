<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-row font-dm text-sm items-center">
            <NuxtLink
                to="/airing/create"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all ml-auto"
            >
                <Icon name="ic:baseline-plus" class="h-4 w-4" />
                Erstellen
            </NuxtLink>
        </div>
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center px-2"> Anime </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Staffel </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Episode </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Typ </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Episode </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Stream </div>
                <div class="text-sm flex-1 flex justify-center items-center"> Release </div>
            </div>
            <div v-if="airings && !isFetching" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="(airing, index) in airings"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/airing/${airing.id}`"
                >
                    <div class="text-sm flex-1 flex justify-center items-center text-center line-clamp-1 px-2">
                        {{ airing.airing_item ? airing.airing_item.name.find((n) => n.locale === 'de-DE')?.name : '' }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ airing.airing_season ? airing.airing_season.season_number : '' }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ airing.episode_number }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ airing.type }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ airing.airing_episode ? 'Existiert' : 'Fehlt' }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{
                            airing.airing_episode && airing.airing_episode.episode_streams && airing.airing_episode.episode_streams.find((e) => e.type === airing.type)
                                ? 'Existiert'
                                : 'Fehlt'
                        }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center capitalize">
                        {{ formatDateToDDMMYYYY(airing.release_date) }}
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!airings && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Airing } from '~/components/types/airings'
import type { Userdata } from '~/components/types/userdata'
definePageMeta({
    layout: 'admin'
})

const config = useRuntimeConfig()

const isFetching = ref<boolean>(false)
const airings = ref<Airing[]>()

const fetchAirings = async () => {
    isFetching.value = true

    const { data, error } = await useAPI<Airing[]>(`/api/airing/admin`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    airings.value = data.value

    isFetching.value = false
}

function formatDateToDDMMYYYY(date: Date) {
    date = new Date(date)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hour = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${hour}:${minutes} - ${day}.${month}.${year}`
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchAirings()
}
</script>

<style></style>
