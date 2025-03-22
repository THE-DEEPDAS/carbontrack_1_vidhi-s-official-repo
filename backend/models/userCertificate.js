// models/UserCertificate.js
import mongoose from 'mongoose';

const userGoalSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the goal in the Certificate model
  completed: { type: Boolean, default: false }, // Whether the user has completed the goal
  proof: { type: String }, // URL to the uploaded proof (e.g., from Cloudinary)
  verified: { type: Boolean, default: false }, // Whether the admin has verified the goal
});

const userCertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user working on this certificate
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', required: true }, // The global certificate
  goals: [userGoalSchema], // Tracks the user's progress for each goal
  progress: { type: Number, default: 0 }, // Percentage of goals completed
  eligible: { type: Boolean, default: false }, // Whether the user can download the certificate
  verified: { type: Boolean, default: false }, // Whether all goals are verified by the admin
});

export default mongoose.model('UserCertificate', userCertificateSchema);