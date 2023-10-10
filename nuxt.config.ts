import { pwa } from './config/pwa'

export default defineNuxtConfig({
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
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

  pwa,

  devtools: {
    enabled: true,
  },

  sourcemap: false,

  telemetry: false,
})
