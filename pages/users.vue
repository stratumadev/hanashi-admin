<template>
    <div class="relative flex flex-col gap-3 ml-72 p-5 min-h-screen font-pjs font-bold">
        <div class="flex flex-col gap-5">
            <div class="flex flex-row justify-between bg-[var(--secondary)] py-3.5 rounded-xl shadow-lg">
                <div class="text-sm flex-1 flex justify-center items-center">ID</div>
                <div class="text-sm flex-1 flex justify-center items-center">Username</div>
                <div class="text-sm flex-1 flex justify-center items-center">Displayname</div>
            </div>
            <div v-if="users && !isFetching" class="flex flex-col gap-3">
                <NuxtLink
                    v-for="user in users"
                    class="relative flex flex-row justify-between bg-[var(--tertiary)] hover:bg-[var(--secondary)] py-3.5 rounded-xl transition-all appear"
                    :to="`/user/${user.id}`"
                >
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ user.id }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ user.username }}
                    </div>
                    <div class="text-sm flex-1 flex justify-center items-center">
                        {{ user.displayname }}
                    </div>
                    <div class="absolute top-1/2 -translate-y-1/2 right-3">
                        <Icon mode="svg" name="ion:open-outline" class="h-4 w-4" />
                    </div>
                </NuxtLink>
            </div>
            <div v-if="!users && isFetching" class="bg-[var(--secondary)] w-full h-96 flex flex-col gap-2 items-center justify-center rounded-xl appear">
                <Icon mode="svg" name="mdi:loading" class="h-8 w-8 animate-spin" />
                <div class="text-sm">Bitte warten</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Rank } from '~/components/types/roles'
import type { Userdata } from '~/components/types/userdata'
import type { User } from '~/components/types/users'
definePageMeta({
    layout: 'admin'
})

const isFetching = ref<boolean>(false)
const users = ref<User[]>()

const fetchUsers = async () => {
    isFetching.value = true
    const { data, error } = await useAPI<User[]>(`/api/user/`, {
        method: 'GET'
    })
    if (error.value) {
        console.log(error.value.data ? error.value.data.message : error.value.message)
        return
    }

    if (!data.value) return

    users.value = data.value
    isFetching.value = false
}

const userdata = useState<Userdata | null>('userdata', () => null)

if (userdata.value) {
    fetchUsers()
}
</script>

<style></style>
