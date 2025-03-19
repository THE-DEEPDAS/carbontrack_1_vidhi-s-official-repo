import mongoose from "mongoose";

const analysisHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  analysis_result: {
    type: Object,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Add index for faster queries
analysisHistorySchema.index({ user: 1, created_at: -1 });

export default mongoose.model("AnalysisHistory", analysisHistorySchema);
