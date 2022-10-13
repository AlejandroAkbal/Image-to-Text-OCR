<script setup>
useHead({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} - Unnamed OCR PWA` : 'Unnamed OCR PWA',
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/favicon.png',
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

html.dark {
  background: #222;
  color: white;
}
</style>
