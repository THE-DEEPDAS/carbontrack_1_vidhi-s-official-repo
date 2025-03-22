import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  energyUsage: { type: Number, default: 0 },
  carbonFootprint: { type: Number, default: 0 },
});

const Department = mongoose.model("Department", DepartmentSchema);
export default Department;
