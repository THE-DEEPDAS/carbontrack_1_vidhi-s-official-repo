import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js"; // Use the provided auth middleware

const router = express.Router();

// Get user data
router.get("/user-data", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users for comparison
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({}, "fullName transport");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (alternative route)
router.get("/users/all", protect, async (req, res) => {
  try {
    const users = await User.find({}, "fullName transport");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
