<script setup lang="ts">
import type { LoggerMessage } from 'tesseract.js'
import { createWorker } from 'tesseract.js'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import type { Ref, UnwrapRef } from 'vue'
import { appDescription, appName } from '../constants'
import type { Language } from '@/assets/scripts/ocr'
import { supportedLanguages, supportedMimeTypes } from '@/assets/scripts/ocr'

const defaultLanguage = supportedLanguages.find(language => language.label === 'English')

if (!defaultLanguage)
  throw new Error('Default language not found')

const selectedLanguages: Ref<UnwrapRef<(Language)[]>> = ref([defaultLanguage])

const media = ref<File | null>(null)
const mediaRender = ref('')

const isProcessing = ref(false)
const progress = ref(0)

const extractedText = ref('')
const extractedConfidence = ref(0)

const hasImage = computed(() => !!media.value)
const hasResults = computed(() => !isProcessing.value && extractedText.value)

const { copy, copied } = useClipboard({ source: extractedText })

let ocrWorker: Tesseract.Worker | undefined

onMounted(async () => {
  document.body.addEventListener('paste', onClipboardPaste)

  onNuxtReady(async () => {
    ocrWorker = await createWorker(undefined, undefined, {
      logger: ocrWorkerLogger,
    })
  })
})

onUnmounted(() => {
  document.body.removeEventListener('paste', onClipboardPaste)
})

function ocrWorkerLogger(message: LoggerMessage) {
  if (message.status !== 'recognizing text')
    return

  progress.value = message.progress
}

function onClipboardPaste(event: ClipboardEvent) {
  event.preventDefault()
  event.stopPropagation()

  if (isProcessing.value || hasResults.value)
    return

  const clipboardData = event.clipboardData

  if (!clipboardData) {
    alert('The clipboard does not contain any data!')
    return
  }

  const eventMedia = clipboardData.files[0]

  if (!eventMedia) {
    alert('The clipboard does not contain any media!')
    return
  }

  if (!supportedMimeTypes.includes(eventMedia.type)) {
    alert(`Media of type "${eventMedia.type}" not supported`)
    return
  }

  renderMedia(eventMedia)

  media.value = eventMedia
}

function onFileDrop(event: DragEvent) {
  if (!event.dataTransfer) {
    alert('The clipboard does not contain any data!')
    return
  }

  const eventMedia = event.dataTransfer.files[0]

  if (!supportedMimeTypes.includes(eventMedia.type)) {
    alert(`Media of type "${eventMedia.type}" not supported`)
    return
  }

  renderMedia(eventMedia)

  media.value = eventMedia
}

function onFileChange(event: Event) {
  if (!event.target) {
    alert('The clipboard does not contain any data!')
    return
  }

  const eventMedia = event.target.files[0]

  if (!supportedMimeTypes.includes(eventMedia.type)) {
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

  await startRecognition()
}

async function onFormReset() {
  media.value = null
  mediaRender.value = ''

  isProcessing.value = false

  progress.value = 0
  extractedText.value = ''
  extractedConfidence.value = 0
}

async function startRecognition() {
  if (!ocrWorker) {
    alert('OCR worker not initialized, please wait a few seconds and try again!')
    return
  }

  if (!media.value) {
    alert('No media selected!')
    return
  }

  isProcessing.value = true

  const parsedLocales = selectedLanguages.value.map(language => language.value).join('+')

  await ocrWorker.reinitialize(parsedLocales)

  // TODO: Upscale image
  //  https://github.com/thekevinscott/UpscalerJS
  // https://github.com/lovell/sharp

  const { data: { text, confidence } } = await ocrWorker.recognize(media.value, {
    rotateAuto: true,
  })

  // TODO: Investigate crash
  // await ocrWorker.terminate()

  extractedText.value = text
  extractedConfidence.value = confidence

  isProcessing.value = false
}

function renderMedia(media: Blob | MediaSource) {
  const objectUrl = URL.createObjectURL(media)

  mediaRender.value = objectUrl
}

function cleanRenderMedia() {
  URL.revokeObjectURL(mediaRender.value)
}
</script>

<template>
  <div class="my-12 flex-auto">
    <section class="min-h-[75vh]">
      <!-- Title & description -->
      <div class="text-center">
        <h1 class="from-indigo-400 to-pink-700 bg-gradient-to-r bg-clip-text text-2xl font-extrabold uppercase text-transparent">
          {{ appName }}
        </h1>

        <h2 class="mt-2 text-lg text-gray-300">
          {{ appDescription }}
        </h2>
      </div>

      <div class="grid mt-12 place-items-center gap-6">
        <!--  -->

        <div v-if="mediaRender" class="space-y-4">
          <!-- Media render -->
          <!-- TODO: Give size ratio to prevent jump -->
          <img
            :src="mediaRender"
            alt="Uploaded media"
            class="h-auto max-h-md max-w-md w-full border border-gray-600 rounded-md object-cover"
          >

          <!-- Progress -->
          <p
            :class="[isProcessing ? 'visible' : 'invisible']"
            class="mb-4 text-center tabular-nums"
          >
            <span>{{ (progress).toLocaleString(undefined, { style: 'percent' }) }}</span>
            Progress
          </p>
        </div>

        <form class="max-w-prose w-full space-y-8" @submit.prevent="onFormSubmit" @reset.prevent="onFormReset">
          <!--  -->

          <!-- Media input -->
          <template
            v-if="!hasImage"
          >
            <div
              class="flex justify-center border-3 border-gray-600 rounded-md border-dashed px-10 pb-10 pt-9"
              @drop.prevent="onFileDrop"
              @dragover.prevent
            >
              <div class="text-center space-y-4">
                <div aria-hidden="true" class="i-carbon-image mx-auto h-12 w-12 text-gray-400" />

                <div class="flex text-gray-300">
                  <label
                    class="relative cursor-pointer rounded-md bg-gray-8 px-1 font-medium text-indigo-400 hover:text-indigo-500"
                    focus-within="outline-none ring-2 ring-indigo-500 ring-offset-2"
                  >
                    <span>Upload an image</span>

                    <input
                      :accept="supportedMimeTypes.join(',')"
                      class="sr-only"
                      type="file"
                      @change="onFileChange"
                      @load="cleanRenderMedia"
                    >
                  </label>

                  <p class="pl-1">
                    or drag and drop
                  </p>
                </div>

                <p class="text-sm uppercase text-gray-400">
                  {{
                    supportedMimeTypes
                      .map(mimeType => mimeType.replace('image/', ''))
                      .join(' · ')
                  }}
                </p>
              </div>
            </div>
          </template>

          <!-- Language -->
          <template v-if="hasImage && !isProcessing && !hasResults">
            <Listbox v-model="selectedLanguages" as="div" multiple>
              <ListboxLabel class="block text-center font-medium text-gray-300">
                Image language
                <span class="mt-1 block text-sm font-normal text-gray-400">
                  Tip: select similar languages for better results, at the cost of speed
                </span>
              </ListboxLabel>

              <div class="relative mt-4">
                <!--  -->

                <div class="flex">
                  <!-- Output -->
                  <ListboxButton
                    class="relative mx-auto max-w-xs w-full cursor-default border border-gray-600 rounded-md bg-dark-600 py-1.5 pl-3 pr-10 text-left text-gray-200 shadow-sm sm:text-sm"
                    focus="border-indigo-500 outline-none ring-2 ring-indigo-500 ring-offset-2"
                  >
                    <span class="block truncate">{{
                      selectedLanguages.map((language) => language.label).join(', ')
                    }}</span>

                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <div aria-hidden="true" class="i-carbon-chevron-down h-5 w-5 text-gray-400" />
                    </span>
                  </ListboxButton>
                </div>

                <!-- Selector -->
                <transition
                  leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <!--  -->

                  <ListboxOptions
                    class="absolute z-10 mt-4 max-h-60 w-full overflow-auto rounded-md bg-dark-600 py-1 text-base shadow-lg ring ring-gray-600 sm:text-sm focus:outline-none"
                  >
                    <!--  -->

                    <ListboxOption
                      v-for="language in supportedLanguages" :key="language.value"
                      v-slot="{ active, selected }" :value="language" as="template"
                    >
                      <li
                        :class="[active ? 'text-white bg-indigo-600' : 'text-gray-200']"
                        class="relative cursor-default select-none py-2 pl-3 pr-9"
                      >
                        <!--  -->

                        <span :class="[selected ? 'font-semibold' : 'font-normal']" class="block truncate">
                          {{ language.label }}
                        </span>

                        <span
                          v-if="selected"
                          :class="[active ? 'text-white' : 'text-indigo-600']"
                          class="absolute inset-y-0 right-0 flex items-center pr-4"
                        >

                          <div aria-hidden="true" class="i-carbon-checkmark h-5 w-5" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </template>

          <!-- Output -->
          <div
            v-if="hasResults"
            class="space-y-6"
          >
            <div class="flex justify-around">
              <h3 class="text-lg font-semibold">
                Recognized text
              </h3>

              <span class="inline-flex items-center rounded-full bg-indigo-800 px-2.5 py-0.5 text-xs font-medium">
                <i
                  :class="{
                    'text-green': extractedConfidence >= 80,
                    'text-amber': extractedConfidence >= 50 && extractedConfidence < 80,
                    'text-red': extractedConfidence < 50,
                  }"
                  aria-hidden="true"
                  class="i-carbon-circle-filled mr-1.5 h-3 w-3 -ml-0.5"
                />

                {{ extractedConfidence }}
              </span>
            </div>

            <div class="relative">
              <output
                class="block whitespace-pre-wrap border border-transparent rounded bg-white p-1 text-black"
                v-text="extractedText"
              />

              <button
                class="absolute right-0 top-0 m-2 border border-transparent rounded-full bg-indigo-700 p-2 text-white hover:bg-indigo-800"
                focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
                type="button"
                @click="copy()"
              >
                <div :class="[copied ? 'i-carbon-task' : 'i-carbon-task-add']" aria-hidden="true" class="h-6 w-6" />

                <span class="sr-only">Copy output</span>
              </button>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="hasImage && !isProcessing" class="text-center">
            <button
              v-if="!hasResults"
              class="inline-flex items-center border border-transparent rounded-full bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm"
              focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
              hover="bg-indigo-700"
              type="submit"
            >
              <span class="mr-2 rounded-full bg-indigo-700 p-2 -ml-2">
                <div aria-hidden="true" class="i-carbon-scan-alt h-5 w-5" />
              </span>

              Extract Text
            </button>

            <button
              v-else
              class="inline-flex items-center border border-transparent rounded-full bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm"
              focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
              hover="bg-indigo-700"
              type="reset"
            >
              <span class="mr-2 rounded-full bg-indigo-700 p-2 -ml-2">
                <div aria-hidden="true" class="i-carbon-reset h-5 w-5" />
              </span>

              Restart
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="mb-12 mt-24 flex flex-col items-center gap-6">
      <!-- Circle -->
      <div class="mx-auto max-w-[max-content] rounded-full bg-[#221d21] px-18 py-12">
        <!-- Header -->
        <span class="sr-only">
          Reviewed on Product Hunt
        </span>

        <a
          href="https://www.producthunt.com/products/image-to-text-2/reviews?utm_source=badge-product_rating&utm_medium=badge&utm_souce=badge-image-to-text-2" target="_blank"
        >
          <img
            width="242"
            height="108"
            loading="lazy"
            src="https://api.producthunt.com/widgets/embed-image/v1/product_rating.svg?product_id=503138&theme=dark"
            alt="Product rating"
          >
        </a>
      </div>
    </section>

    <!-- TODO: Add steps section -->
    <!-- TODO: Add example section -->
    <section />
  </div>
</template>
