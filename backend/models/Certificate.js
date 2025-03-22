// models/Certificate.js
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // Optional description of the goal
});

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  goals: [goalSchema], // List of goals required to earn the certificate
  requirements: [{ type: String }], // Additional requirements (e.g., "Complete all goals")
});

export default mongoose.model('Certificate', certificateSchema);