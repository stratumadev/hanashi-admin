<template>
    <div class="relative flex flex-col ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex text-sm justify-between">
            <NuxtLink to="/users" class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all">
                <Icon mode="svg" name="raphael:arrowleft" class="h-3 w-3" />
                Zurück
            </NuxtLink>
            <button
                @click="editUser()"
                v-on:mouseenter="isSuccessful = false"
                class="flex items-center justify-center gap-1 px-3 py-2.5 bg-[var(--tertiary)] hover:bg-[var(--secondary)] rounded-xl transition-all"
                :class="isSuccessful ? 'bg-[var(--secondary)] hover:bg-[var(--secondary)]' : 'bg-[var(--secondary)]'"
            >
                <Icon mode="svg" name="material-symbols:save-sharp" class="h-3 w-3" />
                {{ isSuccessful ? 'Gepeichert' : 'Änderungen Speichern' }}
            </button>
        </div>
        <div v-if="user" class="flex flex-col mt-10 text-sm">
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Username</div>
                <input
                    v-model="user.username"
                    class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    type="text"
                    placeholder="Username"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Displayname</div>
                <input
                    v-model="user.displayname"
                    class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none"
                    type="text"
                    placeholder="Displayname"
                />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Password</div>
                <input v-model="password" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none" type="text" placeholder="Password" />
            </div>
            <div class="flex flex-row items-center gap-5 py-4">
                <div class="text-base w-48">Berechtigungen</div>
                <select v-model="user.rank" class="w-full px-3 py-2.5 max-w-sm text-white bg-[var(--tertiary)] rounded-xl focus:outline-none">
                    <option v-for="rank in ranks" :value="rank.id">
                        {{ rank.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Rank } from '~/components/types/roles'
import type { Userdata } from '~/components/types/userdata'
import type { User } from '~/components/types/users'
import { useToast } from '@/plugins/useToast'

const { addToast } = useToast()

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const user = ref<User>()
const ranks = ref<Rank[]>()
const password = ref<string>()
const isSuccessful = ref(false)

const fetchUser = async () => {
    const { data, error } = await useAPI<User>(`/api/user/${route.params.id}`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    user.value = data.value
}

const fetchRanks = async () => {
    const { data, error } = await useAPI<Rank[]>(`/api/rank/`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    ranks.value = data.value
}

const editUser = async () => {
    if (!user.value) return

    const { error } = await useAPI(`/api/user/`, {
        method: 'PUT',
        body: {
            id: user.value.id,
            username: user.value.username,
            displayname: user.value.displayname,
            rank: user.value.rank,
            password: password.value ? password.value : undefined
        }
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        addToast({
            title: 'Fehler',
            description: 'Änderungen nicht gespeichert',
            timeout: 5000,
            color: '#aa413a'
        })
        return
    }
    isSuccessful.value = true

    addToast({
        title: 'Gespeichert',
        description: 'Änderungen gespeichert',
        timeout: 5000,
        color: '#2d9124'
    })
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchUser()
    fetchRanks()
}
</script>

<style></style>
