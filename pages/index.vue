<script setup lang="ts">
import type { LoggerMessage } from 'tesseract.js'
import { createWorker } from 'tesseract.js'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import type { Language } from '@/assets/scripts/ocr'
import { supportedLanguages, supportedMimeTypes } from '@/assets/scripts/ocr'

const defaultLanguage = supportedLanguages.find(language => language.label === 'English')

const selectedLanguages = ref<Language[]>([defaultLanguage])

const media = ref<File>(null)
const mediaRender = ref('')

const isProcessing = ref(false)
const progress = ref(0)

const extractedText = ref('')
const extractedConfidence = ref(0)

const hasImage = computed(() => !!media.value)
const hasResults = computed(() => !isProcessing.value && extractedText.value)

const { copy, copied } = useClipboard({ source: extractedText })

const ocrWorker = await createWorker(undefined,
  undefined,
  {
    logger: ocrWorkerLogger,
  })

onMounted(async () => {
  document.body.addEventListener('paste', onClipboardPaste)
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

function onFileDrop(event: DropEvent) {
  const eventMedia = event.dataTransfer.files[0]

  if (!supportedMimeTypes.includes(eventMedia.type)) {
    alert(`Media of type "${eventMedia.type}" not supported`)
    return
  }

  renderMedia(eventMedia)

  media.value = eventMedia
}

function onFileChange(event) {
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
        <!-- TODO: Give size ratio to prevent jump -->
        <img
          :src="mediaRender"
          alt="Uploaded media"
          class="max-w-md w-full max-h-md h-auto border border-gray-600 rounded-md object-cover"
        >

        <!-- Progress -->
        <p
          :class="[isProcessing ? 'visible' : 'invisible']"
          class="text-center mb-4 tabular-nums"
        >
          <span>{{ (progress).toLocaleString(undefined, { style: 'percent' }) }}</span>
          Progress
        </p>
      </div>

      <form class="w-full max-w-prose space-y-8 " @submit.prevent="onFormSubmit" @reset.prevent="onFormReset">
        <!--  -->

        <!-- Media input -->
        <template
          v-if="!hasImage"
        >
          <div
            class="flex justify-center rounded-md border-3 border-dashed border-gray-600 px-10 pt-9 pb-10"
            @drop.prevent="onFileDrop"
            @dragover.prevent
          >
            <div class="space-y-4 text-center">
              <div aria-hidden="true" class="i-carbon-image mx-auto h-12 w-12 text-gray-400" />

              <div class="flex text-gray-300">
                <label
                  class="relative cursor-pointer rounded-md bg-gray-8 font-medium text-indigo-400 hover:text-indigo-500 px-1"
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

              <p class="text-sm text-gray-400 uppercase">
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
              <span class="block text-sm font-normal text-gray-400 mt-1">
                Tip: select similar languages for better results, at the cost of speed
              </span>
            </ListboxLabel>

            <div class="relative mt-4">
              <!--  -->

              <div class="flex">
                <!-- Output -->
                <ListboxButton
                  class="relative w-full max-w-xs cursor-default rounded-md border border-gray-600 bg-dark-600 py-1.5 pl-3 pr-10 mx-auto text-gray-200 text-left shadow-sm sm:text-sm"
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
                  class="absolute z-10 mt-4 max-h-60 w-full overflow-auto rounded-md bg-dark-600 py-1 text-base shadow-lg ring ring-gray-600 focus:outline-none sm:text-sm"
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
              <div
                :class="{
                  'text-green': extractedConfidence >= 80,
                  'text-amber': extractedConfidence >= 50 && extractedConfidence < 80,
                  'text-red': extractedConfidence < 50,
                }"
                aria-hidden="true"
                class="i-carbon-circle-filled -ml-0.5 mr-1.5 h-3 w-3"
              />

              {{ extractedConfidence }}
            </span>
          </div>

          <div class="relative">
            <output
              class="block text-black bg-white whitespace-pre-wrap p-1 border border-transparent rounded"
              v-text="extractedText"
            />

            <button
              class="absolute right-0 top-0 text-white bg-indigo-700 hover:bg-indigo-800 border border-transparent rounded-full p-2 m-2"
              focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
              type="button"
              @click="copy()"
            >
              <div :class="[copied ? 'i-carbon-task' : 'i-carbon-task-add']" aria-hidden="true" class=" w-6 h-6" />

              <span class="sr-only">Copy output</span>
            </button>
          </div>
        </div>

        <!-- Buttons -->
        <div v-if="hasImage && !isProcessing" class="text-center">
          <button
            v-if="!hasResults"
            class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm"
            focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
            hover="bg-indigo-700"
            type="submit"
          >
            <span class="bg-indigo-700 rounded-full p-2 -ml-2 mr-2">
              <div aria-hidden="true" class="i-carbon-scan-alt w-5 h-5" />
            </span>

            Extract Text
          </button>

          <button
            v-else
            class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 px-6 py-1.5 text-base font-medium text-white shadow-sm"
            focus="outline-none ring-2 ring-indigo-500 ring-offset-2"
            hover="bg-indigo-700"
            type="reset"
          >
            <span class="bg-indigo-700 rounded-full p-2 -ml-2 mr-2">
              <div aria-hidden="true" class="i-carbon-reset w-5 h-5" />
            </span>

            Restart
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
