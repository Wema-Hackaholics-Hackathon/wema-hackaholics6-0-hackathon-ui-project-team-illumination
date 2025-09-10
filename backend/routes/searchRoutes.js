import express from "express";
import { searchLocation, confirmCapture } from "../controllers/searchController.js";

const router = express.Router();

// POST /api/search-location
router.post("/search-location", searchLocation);
router.post("/confirm-capture", confirmCapture);

export default router;
