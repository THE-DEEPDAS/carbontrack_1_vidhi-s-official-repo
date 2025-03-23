import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Organization", organizationSchema);
