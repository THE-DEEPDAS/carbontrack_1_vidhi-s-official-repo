import express from "express";
import mongoose from "mongoose";
import { authenticateUser, protect } from "../middleware/auth.js";
import Voucher from "../models/Voucher.js";
import User from "../models/User.js";

const router = express.Router();

// Fetch available vouchers for a user
router.get("/vouchers", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all available vouchers
    const vouchers = await Voucher.find({}).populate(
      "organization",
      "organizationName"
    );
    res.json({ vouchers, wallet: user.wallet });
  } catch (err) {
    console.error("Error fetching vouchers:", err);
    res.status(500).json({ error: "Failed to fetch vouchers" });
  }
});

// Claim a voucher
router.post("/claim-voucher", protect, async (req, res) => {
  try {
    const { voucherId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    user.wallet += voucher.amount;
    user.vouchers = user.vouchers.filter((v) => v.toString() !== voucherId);
    await user.save();
    await Voucher.findByIdAndDelete(voucherId);

    console.log("Voucher claimed successfully. Updated wallet:", user.wallet); // Debug log
    res.json({ wallet: user.wallet });
  } catch (err) {
    console.error("Error claiming voucher:", err);
    res.status(500).json({ error: "Failed to claim voucher" });
  }
});

// Offer a voucher
router.post("/offer-voucher", protect, async (req, res) => {
  try {
    console.log("Offer Voucher - Request Body:", req.body);

    const { amount, description } = req.body;

    // Validate input
    if (!amount || !description) {
      return res
        .status(400)
        .json({ error: "Amount and description are required." });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than zero." });
    }

    // Fetch the organization offering the voucher
    const organization = await User.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Create the voucher
    const voucher = new Voucher({
      organization: organization._id,
      amount,
      description,
    });
    await voucher.save();

    // Add the voucher to the organization's vouchers array
    organization.vouchers.push(voucher._id);
    await organization.save();

    console.log("Voucher created successfully:", voucher); // Debug log
    res.json({ message: "Voucher offered successfully" });
  } catch (err) {
    console.error("Error in /offer-voucher:", err);
    res
      .status(500)
      .json({ error: "Failed to offer voucher. Please try again later." });
  }
});

export default router;
