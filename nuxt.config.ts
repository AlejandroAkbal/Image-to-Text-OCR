export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  experimental: {
    reactivityTransform: true,
    inlineSSRStyles: false,
  },

  vite: {
    define: {
      'process.env.TESS_ENV': undefined,
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  telemetry: false,
})
