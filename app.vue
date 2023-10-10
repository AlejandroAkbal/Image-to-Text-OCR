<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} - ${appName}` : appName,
  meta: [
    { name: 'description', content: 'Extract text from any image using OCR' },

    { name: 'og:type', content: 'website' },
    { name: 'og:image', content: '/social.jpg' },
  ],
  link: [
    {
      rel: 'icon', type: 'image/svg', href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <VitePwaManifest />
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
