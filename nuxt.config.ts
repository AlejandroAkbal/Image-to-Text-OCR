export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
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
    // TODO: Disabled until prerendering works
    // prerender: {
    //   crawlLinks: false,
    //   routes: ['/'],
    // },
  },

  telemetry: false,
})
