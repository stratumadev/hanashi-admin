<template>
    <div class="min-h-screen bg-[var(--main)] text-white font-pjs">
        <SideNav />
        <Toast />
        <slot />
    </div>
</template>

<script lang="ts" setup>
import type { Session } from "~/components/types/token";
import type { Userdata } from "~/components/types/userdata";

const session = useCookie<Session | undefined>("auth", {
    default: () => undefined,
    maxAge: 2628000,
});

const userdata = useState<Userdata | null>('userdata', () => null)

async function getUserdata() {
    const { data, error } = await useAPI<Userdata>(`/api/user/data`, {
        method: "GET",
    });
    if (error.value || !data.value) {
        console.log(error.value);
        return;
    }

    userdata.value = data.value;
}

if (session.value && session.value.type === "granted_access_token") {
    getUserdata()
}
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
