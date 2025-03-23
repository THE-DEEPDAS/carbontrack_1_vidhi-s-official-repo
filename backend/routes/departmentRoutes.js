import express from "express";
import Department from "../models/Department.js";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// Fetch all departments
router.get("/", protect, async (req, res) => {
  try {
    // Double-check: no filtering logic, seeds, or references to "Default"
    const departments = await Department.find(); // Always return all departments
    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Create a new department
router.post("/", protect, async (req, res) => {
  try {
    console.log("POST /api/departments - Request Body:", req.body); // Debug log
    const { name, energyUsage, carbonFootprint } = req.body;

    if (!name || energyUsage == null || carbonFootprint == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const department = new Department({
      name,
      energyUsage,
      carbonFootprint,
    });

    await department.save();
    console.log("POST /api/departments - Department created:", department); // Debug log
    res.status(201).json(department);
  } catch (err) {
    console.error("Error creating department:", err);
    res.status(500).json({ error: "Failed to create department" });
  }
});

// Delete a department
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /api/departments/:id - ID:", id); // Debug log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    console.log(
      "DELETE /api/departments/:id - Department deleted:",
      department
    ); // Debug log
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({ error: "Failed to delete department" });
  }
});

// Export department reports
router.get("/report", protect, async (req, res) => {
  try {
    const { ids } = req.query;
    let query = {};

    if (ids && ids !== "undefined") {
      const idArray = ids.split(",");
      query._id = { $in: idArray };
    }

    const departments = await Department.find(query);
    if (!departments || departments.length === 0) {
      return res.status(404).json({ error: "No departments found." });
    }

    const report = departments.map((dep) => ({
      name: dep.name,
      energyUsage: dep.energyUsage,
      carbonFootprint: dep.carbonFootprint,
    }));

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${ids ? "selected_report.json" : "all_report.json"}`
    );
    res.status(200).send(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

export default router;
