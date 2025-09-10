import { OCRService } from '../services/ocrService.js'

const ocrService = new OCRService()

export class OCRController {
  static async processImage (imagePath) {
    const text = await ocrService.extractTextFromImage(imagePath)

    return text
  }
}
