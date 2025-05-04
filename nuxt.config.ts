export default defineNuxtConfig({
    typescript: {
        typeCheck: true
    },

    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@nuxt/icon'],

    googleFonts: {
        families: {
            'Plus+Jakarta+Sans': {
                wght: '200..800'
            }
        }
    },

    app: {
        head: {
            htmlAttrs: {
                lang: 'en'
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1'
        }
    },

    runtimeConfig: {
        public: {
            origin: '',
            origincdn: ''
        }
    },

    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag.includes('-')
        }
    },

    icon: {
        clientBundle: {
            scan: true
        }
    },

    plugins: [{ src: '~/plugins/altcha.ts', mode: 'client' }],
    compatibilityDate: '2024-08-07'
})
