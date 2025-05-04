<template>
    <div class="hidden fixed xl:flex flex-col bottom-0 left-0 z-10 h-screen w-72 text-white font-bold">
        <div class="relative flex flex-col gap-2 h-screen w-full bg-[var(--secondary)] shadow-lg p-2.5">
            <div class="flex items-center justify-center pt-3">
                <img src="/logo.avif" alt="Logo Aniline" class="h-10" />
            </div>
            <div v-if="userdata" class="text-xs text-center p-2">
                Willkommen, {{ userdata.displayname }} <br />
                Systemlevel: {{ userdata.user_rank.name }}
            </div>
            <!-- <NuxtLink
                to="/"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="
                    '/' === route.fullPath
                        ? 'bg-[#c8d5e13a]'
                        : 'bg-transparent hover:bg-[#d0d9e131]'
                "
            >
                <div
                    class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full"
                >
                    <Icon mode="svg" name="bx:stats" class="h-5 w-5" />
                </div>
                Statistiken
            </NuxtLink>
            <NuxtLink
                to="/automation"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="
                    route.path.includes('/automation')
                        ? 'bg-[#c8d5e13a]'
                        : 'bg-transparent hover:bg-[#d0d9e131]'
                "
            >
                <div
                    class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full"
                >
                    <Icon mode="svg" name="mingcute:ai-fill" class="h-5 w-5" />
                </div>
                Automation (Autolinker)
            </NuxtLink> -->
            <NuxtLink
                to="/deadlinks"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/deadlinks') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="mdi:dead" class="h-5 w-5" />
                </div>
                Tote Links
            </NuxtLink>
            <NuxtLink
                to="/calendar"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/calendar') || route.path.includes('/airing') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="mdi:calendar" class="h-5 w-5" />
                </div>
                Kalender
            </NuxtLink>
            <NuxtLink
                to="/animes"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/animes') || route.path.includes('/anime') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="material-symbols:category" class="h-5 w-5" />
                </div>
                Animes
            </NuxtLink>
            <!-- <NuxtLink
                to="/hentais"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="
                    route.path.includes('/hentais') ||
                    route.path.includes('/hentai')
                        ? 'bg-[#c8d5e13a]'
                        : 'bg-transparent hover:bg-[#d0d9e131]'
                "
            >
                <div
                    class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full"
                >
                    <Icon mode="svg" name="material-symbols:category" class="h-5 w-5" />
                </div>
                Hentais
            </NuxtLink> -->
            <!-- <NuxtLink
                to="/slider"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="
                    route.path.includes('/slider') ||
                    route.path.includes('/slider')
                        ? 'bg-[#c8d5e13a]'
                        : 'bg-transparent hover:bg-[#d0d9e131]'
                "
            >
                <div
                    class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full"
                >
                    <Icon mode="svg" name="material-symbols:category" class="h-5 w-5" />
                </div>
                Slider
            </NuxtLink> -->
            <NuxtLink
                to="/categories"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/categories') || route.path.includes('/category') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="material-symbols:category" class="h-5 w-5" />
                </div>
                Kategorien
            </NuxtLink>
            <NuxtLink
                to="/hosters"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/hosters') || route.path.includes('/hoster') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="clarity:host-solid" class="h-5 w-5" />
                </div>
                Hoster
            </NuxtLink>
            <NuxtLink
                to="/users"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/users') || route.path.includes('/user') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="lets-icons:user-fill" class="h-5 w-5" />
                </div>
                Benutzer
            </NuxtLink>
            <NuxtLink
                to="/ranks"
                class="flex items-center gap-2 font-dm px-2.5 py-2.5 text-sm rounded-xl transition-all"
                :class="route.path.includes('/ranks') || route.path.includes('/rank') ? 'bg-[#c8d5e13a]' : 'bg-transparent hover:bg-[#d0d9e131]'"
            >
                <div class="flex items-center justify-center h-10 w-10 bg-[var(--tertiary)] rounded-full">
                    <Icon mode="svg" name="mdi:rank" class="h-5 w-5" />
                </div>
                Rollen
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Userdata } from './types/userdata'

const route = useRoute()

const userdata = useState<Userdata | null>('userdata', () => null)
</script>

<style></style>
