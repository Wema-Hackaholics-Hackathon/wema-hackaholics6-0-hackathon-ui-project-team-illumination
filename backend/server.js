import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRoutes from "./routes/searchRoutes.js"
import kycRoute from './routes/kycRoute.js'
import verifyRoutes from './routes/verifyRoutes.js'
import uploadRoute from './routes/uploadRoute.js'

dotenv.config()


const app = express()
app.use(cors({ origin: '*' }))

app.use(express.json())

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'kyc-trustscore-backend' })
})

app.use(kycRoute)
app.use(verifyRoutes)
app.use(searchRoutes);
app.use(uploadRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`)
})
