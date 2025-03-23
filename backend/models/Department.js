import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  energyUsage: { type: Number, required: true },
  carbonFootprint: { type: Number, required: true },
  createdAt: { type: Date },
});

// Ensure no default departments are added programmatically
// Confirm no default departments are added here or in database initialization
// Remove any seed logic or hardcoded data in the database initialization

export default mongoose.model("Department", departmentSchema);
