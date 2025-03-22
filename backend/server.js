import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  generateReport,
  getDepartmentAverages,
} from "./controllers/DepartmentController.js";

dotenv.config({});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes); // Ensure this matches the frontend API call
app.use("/api", userRoutes); // Register user routes

// Department routes
app.post("/api/departments", createDepartment);
app.get("/api/departments", getAllDepartments);
app.delete("/api/departments/:id", deleteDepartment);
app.get("/api/departments/report", generateReport);
app.get("/api/departments/averages", getDepartmentAverages);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Global error handler for uncaught exceptions
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Trying a different port...`
      );
      app.listen(0, () => {
        console.log(`Server running on a random available port`);
      });
    }
  });
