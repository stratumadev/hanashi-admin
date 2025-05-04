<template>
    <div class="fixed bottom-5 right-5 z-20">
        <transition-group name="toast-fade" tag="div" class="flex flex-col gap-2">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="relative bg-[var(--secondary)] w-96 px-3 py-4 border-2 border-[var(--tertiary)] rounded-xl shadow-xl transition-all duration-200 overflow-hidden"
            >
                <div class="flex flex-row font-pjs font-bold gap-2">
                    <div class="flex flex-col">
                        <div class="text-base">{{ toast.title }}</div>
                        <div class="text-sm">{{ toast.description }}</div>
                    </div>
                </div>
                <div v-if="toast.color" class="absolute w-2 h-full top-0 right-0" :style="`background-color: ${toast.color};`"> </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { useToast } from '@/plugins/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 300ms ease;
}
.toast-fade-enter-from {
    opacity: 0;
    transform: translateY(2rem);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-2rem);
}
</style>
