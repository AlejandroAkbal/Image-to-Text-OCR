import type Tesseract from 'tesseract.js'
// import { OEM, PSM } from 'tesseract.js'

export async function OcrRecognize(worker: Tesseract.Worker, media: Tesseract.ImageLike) {
  await worker.load()

  await worker.loadLanguage('eng')

  await worker.initialize('eng')

  // await worker.setParameters({
  //   tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
  //   tessedit_pageseg_mode: PSM.AUTO,
  // })

  const { data } = await worker.recognize(media)

  await worker.terminate()

  return data
}
