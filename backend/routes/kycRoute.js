import express from "express";
import KYCController from "../controllers/kycController.js";

const router = express.Router();

router.post("/verifykyc", async (req, res) => {
  const { bvn } = req.body;

  if (!bvn) {
    res.status(400).json({'error': 'bvn is required'})
    return
  }

  try {
    const info = await KYCController.verifyBVN(bvn)
    res.json(info)
  } catch (e) {
    res.status(400).json({'error': e})
    return
  }
});

export default router;
