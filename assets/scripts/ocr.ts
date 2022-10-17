import type Tesseract from 'tesseract.js'
// import { OEM, PSM } from 'tesseract.js'

export async function OcrRecognize(worker: Tesseract.Worker, languages: typeof supportedLanguages, media: Tesseract.ImageLike) {
  const parsedLocales = languages.map(language => language.value).join('+')

  await worker.load()

  await worker.loadLanguage(parsedLocales)

  await worker.initialize(parsedLocales)

  // await worker.setParameters({
  //   tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
  //   tessedit_pageseg_mode: PSM.AUTO,
  // })

  const { data } = await worker.recognize(media)

  await worker.terminate()

  return data
}

export const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/pbm']

export const supportedLanguages = [
  { value: 'afr', label: 'Afrikaans' },
  { value: 'amh', label: 'Amharic' },
  { value: 'ara', label: 'Arabic' },
  { value: 'asm', label: 'Assamese' },
  { value: 'aze', label: 'Azerbaijani' },
  { value: 'aze_cyrl', label: 'Azerbaijani - Cyrillic' },
  { value: 'bel', label: 'Belarusian' },
  { value: 'ben', label: 'Bengali' },
  { value: 'bod', label: 'Tibetan' },
  { value: 'bos', label: 'Bosnian' },
  { value: 'bul', label: 'Bulgarian' },
  { value: 'cat', label: 'Catalan; Valencian' },
  { value: 'ceb', label: 'Cebuano' },
  { value: 'ces', label: 'Czech' },
  { value: 'chi_sim', label: 'Chinese - Simplified' },
  { value: 'chi_tra', label: 'Chinese - Traditional' },
  { value: 'chr', label: 'Cherokee' },
  { value: 'cym', label: 'Welsh' },
  { value: 'dan', label: 'Danish' },
  { value: 'deu', label: 'German' },
  { value: 'dzo', label: 'Dzongkha' },
  { value: 'ell', label: 'Greek, Modern (1453-)' },
  { value: 'eng', label: 'English' },
  { value: 'enm', label: 'English, Middle (1100-1500)' },
  { value: 'epo', label: 'Esperanto' },
  { value: 'est', label: 'Estonian' },
  { value: 'eus', label: 'Basque' },
  { value: 'fas', label: 'Persian' },
  { value: 'fin', label: 'Finnish' },
  { value: 'fra', label: 'French' },
  { value: 'frk', label: 'German Fraktur' },
  { value: 'frm', label: 'French, Middle (ca. 1400-1600)' },
  { value: 'gle', label: 'Irish' },
  { value: 'glg', label: 'Galician' },
  { value: 'grc', label: 'Greek, Ancient (-1453)' },
  { value: 'guj', label: 'Gujarati' },
  { value: 'hat', label: 'Haitian; Haitian Creole' },
  { value: 'heb', label: 'Hebrew' },
  { value: 'hin', label: 'Hindi' },
  { value: 'hrv', label: 'Croatian' },
  { value: 'hun', label: 'Hungarian' },
  { value: 'iku', label: 'Inuktitut' },
  { value: 'ind', label: 'Indonesian' },
  { value: 'isl', label: 'Icelandic' },
  { value: 'ita', label: 'Italian' },
  { value: 'ita_old', label: 'Italian - Old' },
  { value: 'jav', label: 'Javanese' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'kan', label: 'Kannada' },
  { value: 'kat', label: 'Georgian' },
  { value: 'kat_old', label: 'Georgian - Old' },
  { value: 'kaz', label: 'Kazakh' },
  { value: 'khm', label: 'Central Khmer' },
  { value: 'kir', label: 'Kirghiz; Kyrgyz' },
  { value: 'kor', label: 'Korean' },
  { value: 'kur', label: 'Kurdish' },
  { value: 'lao', label: 'Lao' },
  { value: 'lat', label: 'Latin' },
  { value: 'lav', label: 'Latvian' },
  { value: 'lit', label: 'Lithuanian' },
  { value: 'mal', label: 'Malayalam' },
  { value: 'mar', label: 'Marathi' },
  { value: 'mkd', label: 'Macedonian' },
  { value: 'mlt', label: 'Maltese' },
  { value: 'msa', label: 'Malay' },
  { value: 'mya', label: 'Burmese' },
  { value: 'nep', label: 'Nepali' },
  { value: 'nld', label: 'Dutch; Flemish' },
  { value: 'nor', label: 'Norwegian' },
  { value: 'ori', label: 'Oriya' },
  { value: 'pan', label: 'Panjabi; Punjabi' },
  { value: 'pol', label: 'Polish' },
  { value: 'por', label: 'Portuguese' },
  { value: 'pus', label: 'Pushto; Pashto' },
  { value: 'ron', label: 'Romanian; Moldavian; Moldovan' },
  { value: 'rus', label: 'Russian' },
  { value: 'san', label: 'Sanskrit' },
  { value: 'sin', label: 'Sinhala; Sinhalese' },
  { value: 'slk', label: 'Slovak' },
  { value: 'slv', label: 'Slovenian' },
  { value: 'spa', label: 'Spanish; Castilian' },
  { value: 'spa_old', label: 'Spanish; Castilian - Old' },
  { value: 'sqi', label: 'Albanian' },
  { value: 'srp', label: 'Serbian' },
  { value: 'srp_latn', label: 'Serbian - Latin' },
  { value: 'swa', label: 'Swahili' },
  { value: 'swe', label: 'Swedish' },
  { value: 'syr', label: 'Syriac' },
  { value: 'tam', label: 'Tamil' },
  { value: 'tel', label: 'Telugu' },
  { value: 'tgk', label: 'Tajik' },
  { value: 'tgl', label: 'Tagalog' },
  { value: 'tha', label: 'Thai' },
  { value: 'tir', label: 'Tigrinya' },
  { value: 'tur', label: 'Turkish' },
  { value: 'uig', label: 'Uighur; Uyghur' },
  { value: 'ukr', label: 'Ukrainian' },
  { value: 'urd', label: 'Urdu' },
  { value: 'uzb', label: 'Uzbek' },
  { value: 'uzb_cyrl', label: 'Uzbek - Cyrillic' },
  { value: 'vie', label: 'Vietnamese' },
  { value: 'yid', label: 'Yiddish' },
]
