import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import kycRoute from "./routes/kycRoute.js";

dotenv.config()

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(kycRoute);

// Health check
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "kyc-trustscore-backend" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
