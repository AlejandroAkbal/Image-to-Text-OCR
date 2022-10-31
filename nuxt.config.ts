export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  experimental: {
    reactivityTransform: true,
  },

  vite: {
    define: {
      'process.env.TESS_ENV': undefined,
    },
  },

  unocss: {
    preflight: true,
  },

  colorMode: {
    classSuffix: '',
  },

  telemetry: false,
})
