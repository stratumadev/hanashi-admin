<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm justify-between">
            <NuxtLink to="/ranks" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="createRank()"
                v-on:mouseenter="isSuccessful = false"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
                :class="isSuccessful ? 'bg-[var(--secondary)] hover:bg-[var(--secondary)]' : 'bg-[var(--secondary)]'"
            >
                <Icon mode="svg" name="material-symbols:save-sharp" class="h-3 w-3" />
                {{ isSuccessful ? 'Erstellt' : 'Erstellen' }}
            </button>
        </div>
        <div v-if="rank" class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Name</div>
                <input v-model="rank.name" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Name" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Berechtigungen</div>
                <select v-model="rankType" class="w-full px-3 py-2.5 max-w-xs text-white bg-[var(--tertiary)] rounded-xl focus:outline-none cursor-pointer">
                    <option value="default">Default</option>
                    <option value="tester">Tester</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="dev">Dev</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { RankCreate } from '~/components/types/roles'
import { useToast } from '@/plugins/useToast'

const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const rank = ref<RankCreate>({
    name: ''
})
const isSuccessful = ref(false)

const rankType = ref<'default' | 'tester' | 'moderator' | 'admin' | 'dev'>('default')

const createRank = async () => {
    if (!rank.value) return

    const { error } = await useAPI(`/api/rank/`, {
        method: 'POST',
        body: {
            name: rank.value.name,
            default: rankType.value === 'default' ? true : false,
            tester: rankType.value === 'tester' ? true : false,
            moderator: rankType.value === 'moderator' ? true : false,
            admin: rankType.value === 'admin' ? true : false,
            dev: rankType.value === 'dev' ? true : false
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        addToast({
            title: 'Fehler',
            description: 'Konnte nicht gespeichert werden',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }
    isSuccessful.value = true

    addToast({
        title: 'Erstellt',
        description: 'Rolle wurde erstellt!',
        timeout: 5000,
        color: '#2d9124'
    })
}
</script>

<style></style>
