import express from "express";
import KYCController from "../controllers/kycController.js";

const router = express.Router();

router.post("/verifykyc", async (req, res) => {
  const { fullName, DOB, bvn } = req.body;

  if (!fullName || !DOB || !bvn) {
    res.status(400).json({'error': 'required fields are fullName, DOB and bvn'})
    return
  }

  try {
    const info = await KYCController.verifyBVN(bvn)
    console.log(info)
    res.json(info)
  } catch (e) {
    console.log(e.toString())
    res.status(400).json({'error': e})
    return
  }
});

export default router;
