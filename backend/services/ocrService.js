import vision from '@google-cloud/vision'
import 'dotenv/config'

export class OCRService {
  constructor () {
    this.client = new vision.ImageAnnotatorClient({ keyFile: process.env.GOOGLE_SERVICE_CREDENTIALS_PATH })
  }

  async extractTextFromImage (imagePath) {
    const [result] = await this.client.textDetection(imagePath)
    const text = result.textAnnotations

    return text.map((annotation) => annotation.description)
  }
}
