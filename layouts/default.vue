<script setup lang="ts">
</script>

<template>
  <main class="mx-auto h-full w-full flex flex-col px-4 container lg:px-8 sm:px-6">
    <slot />

    <div style="height: 150px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
        preserveAspectRatio="none"
        style="height: 100%; width: 100%;"
        fill="currentColor"
        class="text-dark-400"
      >
        <path d="M0,169.999999C-1.616539,137.446846,13.726265,75.780155,82.30198,68.03837C138.309058,61.715508,206.6464,83.07792,389.1959,41.61752C498.253797,23.416689,501.230499,139.416748,500,169.999999h-500Z" transform="translate(0-19.999999)" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <Footer />
  </main>
</template>
