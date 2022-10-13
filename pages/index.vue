<script setup>
import { createWorker } from 'tesseract.js'

const mediaElement = ref(null)

const progress = ref(0)
const extractedText = ref('')

const OcrWorker = createWorker({
  logger: (message) => {
    // console.debug(message)

    if (message.status !== 'recognizing text')
      return

    progress.value = message.progress
  },
})

async function OcrRecognize(media) {
  await OcrWorker.load()

  await OcrWorker.loadLanguage('eng')

  await OcrWorker.initialize('eng')

  const { data: { text } } = await OcrWorker.recognize(media)

  await OcrWorker.terminate()

  return text
}

async function startRecognition() {
  // Reset
  progress.value = 0
  extractedText.value = ''

  const media = mediaElement.value.files[0]

  const text = await OcrRecognize(media)

  extractedText.value = text
}
</script>

<template>
  <h1 class="text-center text-xl font-semibold mb-4">
    Unnamed OCR PWA
  </h1>

  <!-- Language -->

  <div class="mb-4">
    <span>{{ (progress).toLocaleString(undefined, { style: 'percent' }) }}</span>
    Progress
  </div>

  <form @submit.prevent="startRecognition">
    <input ref="mediaElement" type="file" accept="image/bmp,image/jpg,image/png,image/pbm,image/webp" required>

    <textarea v-model="extractedText" class="block w-full min-h-36 h-fit text-black bg-white mb-4" />

    <button type="submit" class="btn">
      Submit
    </button>
  </form>
</template>
