export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],

  vite: {
    define: {
      'process.env.TESS_ENV': undefined,
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  telemetry: false,
  compatibilityDate: '2024-12-31',
})
