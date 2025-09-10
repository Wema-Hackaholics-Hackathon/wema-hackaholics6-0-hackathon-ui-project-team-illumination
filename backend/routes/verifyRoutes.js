import express from "express";
import { verifyAddress } from "../controllers/verifyController.js";

const router = express.Router();

// POST /api/verify-address
router.post("/", verifyAddress);

export default router;
