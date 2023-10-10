<script setup lang="ts">
import { appDescription, appName } from '~/constants'

useHead({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} - ${appName}` : appName,
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    { name: 'description', content: appDescription },

    { name: 'og:type', content: 'website' },
    { name: 'og:image', content: '/social.jpg' },

    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg',
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html {
  @apply text-white bg-dark-700;
}
</style>
