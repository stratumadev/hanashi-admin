<template>
    <div class="min-h-screen bg-[var(--main)] text-white font-pjs">
        <slot />
    </div>
</template>

<script lang="ts" setup>
</script>

<style>
:root {
    --main: #121212;
    --secondary: #212121;
    --tertiary: #313131;
    --text-dark: #9a8d8d;
    --text-light: white;
}

.font-pjs {
    font-family: "Plus Jakarta Sans", sans-serif;
    font-style: normal;
}
</style>
