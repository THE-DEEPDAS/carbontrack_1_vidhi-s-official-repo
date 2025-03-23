import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }, // Reference Organization
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Voucher", VoucherSchema);
