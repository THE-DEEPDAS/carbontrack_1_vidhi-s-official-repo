import express from "express";
import { saveUserData, getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/user-data", protect, saveUserData); // Save user data
router.get("/user-data", protect, getUserData); // Get user data

export default router;
