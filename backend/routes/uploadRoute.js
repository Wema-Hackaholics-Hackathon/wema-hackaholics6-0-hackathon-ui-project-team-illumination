import express from 'express'
import multer from 'multer'

import { OCRController } from '../controllers/ocrController.js'

const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post('/upload', upload.single('file'), async (req, res) => {
  const cred = req.file
  if (!cred) {
    return res.status(403).send('No file uploaded.')
  }

  try {
    const text = await OCRController.processImage(cred.path)
    res.json({ text })
  } catch (e) {
    res.status(500).send('Error processing image.')
  }
})

export default router
