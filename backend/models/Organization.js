import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  contactEmail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Ensure no default organizations are added programmatically
// If there is a seed script or initialization logic, remove the default organizations

export default mongoose.model("Organization", organizationSchema);
