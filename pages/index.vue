<script setup>
import { createWorker } from 'tesseract.js'
import { OcrRecognize } from '@/assets/scripts/ocr'

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/pbm']

const media = ref(null)
const mediaRender = ref('')

const isProcessing = ref(false)

const progress = ref(0)
const extractedText = ref('')
const extractedConfidence = ref(0)

const hasResults = computed(() => !isProcessing.value && extractedText.value)

/**
 * @param {DropEvent} event
 */
function onFileDrop(event) {
  const eventMedia = event.dataTransfer.files[0]

  if (!SUPPORTED_MIME_TYPES.includes(eventMedia.type)) {
    alert(`Media of type "${eventMedia.type}" not supported`)
    return
  }

  renderMedia(eventMedia)

  media.value = eventMedia
}

function onFileChange(event) {
  const eventMedia = event.target.files[0]

  if (!SUPPORTED_MIME_TYPES.includes(eventMedia.type)) {
    alert(`Media of type "${eventMedia.type}" not supported`)
    return
  }

  renderMedia(eventMedia)

  media.value = eventMedia
}

async function onFormSubmit() {
  if (!media.value) {
    alert('No media selected!')
    return
  }

  startRecognition(media.value)
}

async function onFormReset() {
  // media.value = null
  // mediaRender.value = ''

  // progress.value = 0
  // extractedText.value = ''
  // extractedConfidence.value = 0

  // Poor man's reset
  window.location.reload()
}

/**
 * @param {Tesseract.ImageLike} media
 */
async function startRecognition(media) {
  isProcessing.value = true

  // Setup
  const ocrWorker = createWorker({
    logger: (message) => {
      if (message.status !== 'recognizing text')
        return

      progress.value = message.progress
    },
  })

  const { text, confidence } = await OcrRecognize(ocrWorker, media)

  extractedText.value = text
  extractedConfidence.value = confidence

  isProcessing.value = false
}

/**
 * @param {Blob|MediaSource} media
 */
function renderMedia(media) {
  const objectUrl = URL.createObjectURL(media)

  mediaRender.value = objectUrl
}

function cleanRenderMedia() {
  URL.revokeObjectURL(mediaRender.value)
}
</script>

<template>
  <div class="py-10 flex-auto">
    <!--  -->

    <!-- Title & description -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-700 uppercase">
        Image to Text
      </h1>

      <h2 class="text-gray-300 text-lg">
        Extract text from any image using OCR
      </h2>
    </div>

    <div class="grid place-items-center">
      <!--  -->

      <div v-if="mediaRender" class="mb-6 space-y-4">
        <!-- Media render -->
        <img
          class="max-w-md w-full max-h-md h-auto border border-gray-600 rounded-md object-cover"
          :src="mediaRender"
          alt="Uploaded media"
        >

        <!-- Progress -->
        <p
          v-if="isProcessing"
          class="text-center mb-4"
        >
          <span>{{ (progress).toLocaleString(undefined, { style: 'percent' }) }}</span>
          Progress
        </p>
      </div>

      <form class="w-full max-w-prose space-y-8 " @submit.prevent="onFormSubmit" @reset.prevent="onFormReset">
        <!-- TODO: Language selector -->

        <!-- Media input -->
        <div
          v-if="!hasResults"
          class="flex justify-center rounded-md border-3 border-dashed border-gray-600 px-10 pt-9 pb-10"
          @drop.prevent="onFileDrop"
          @dragover.prevent
        >
          <div class="space-y-4 text-center">
            <div class="i-carbon-image mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />

            <div class="flex text-gray-300">
              <label
                class="relative cursor-pointer rounded-md bg-gray-8 font-medium text-indigo-400 hover:text-indigo-500 px-1"
                focus-within="outline-none ring-2 ring-indigo-500 ring-offset-2"
              >
                <span>Upload an image</span>

                <input
                  type="file"
                  class="sr-only"
                  :accept="SUPPORTED_MIME_TYPES.join(',')"
                  @change="onFileChange"
                  @load="cleanRenderMedia"
                >
              </label>

              <p class="pl-1">
                or drag and drop
              </p>
            </div>

            <p class="text-sm text-gray-400 uppercase">
              {{
                SUPPORTED_MIME_TYPES
                  .map(mimeType => mimeType.replace('image/', ''))
                  .join(' · ')
              }}
            </p>
          </div>
        </div>

        <!-- Output -->
        <div
          v-else
          class="space-y-2"
        >
          <div class="flex justify-around">
            <h3 class="text-lg font-semibold">
              Recognized text
            </h3>

            <span class="inline-flex items-center rounded-full bg-indigo-900 px-2.5 py-0.5 text-xs font-medium -indigo-800">
              <div
                class="i-carbon-circle-filled -ml-0.5 mr-1.5 h-3 w-3"
                :class="{
                  'text-green': extractedConfidence >= 80,
                  'text-amber': extractedConfidence >= 50 && extractedConfidence < 80,
                  'text-red': extractedConfidence < 50,
                }"
                aria-hidden="true"
              />

              {{ extractedConfidence }}
            </span>
          </div>

          <output
            class="block text-black bg-white whitespace-pre-wrap p-1 border border-transparent rounded"
            v-text="extractedText"
          />

          <!-- TODO: Floating copy button on right -->
        </div>

        <!-- Buttons -->
        <div class="text-center">
          <button
            v-if="!hasResults"
            type="submit"
            :disabled="isProcessing"
            class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm disabled:bg-indigo-900"
            hover="bg-indigo-700"
            focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
          >
            <span class="bg-indigo-700 rounded-full p-2 -ml-2 mr-2">
              <div class="i-carbon-scan-alt w-5 h-5" aria-hidden="true" />
            </span>

            Extract Text
          </button>

          <button
            v-else
            type="reset"
            class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm disabled:bg-indigo-900"
            hover="bg-indigo-700"
            focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
          >
            <span class="bg-indigo-700 rounded-full p-2 -ml-2 mr-2">
              <div class="i-carbon-reset w-5 h-5" aria-hidden="true" />
            </span>

            Restart
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
