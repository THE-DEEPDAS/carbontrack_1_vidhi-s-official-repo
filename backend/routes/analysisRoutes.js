import express from "express";
import {
  analyzeProduct,
  getUserAnalysisHistory,
  getAnalysisById,
} from "../controllers/analysisController.js";
import { protect } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Product analysis route
router.post("/product", protect, upload.single("image"), analyzeProduct);
// Ensure this route is correctly defined and matches the frontend API call

// Analysis history routes
router.get("/history", protect, getUserAnalysisHistory);
router.get("/history/:id", protect, getAnalysisById);

export default router;
