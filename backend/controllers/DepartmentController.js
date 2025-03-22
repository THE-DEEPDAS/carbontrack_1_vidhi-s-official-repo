import Department from "../models/Department.js";

// Create a new department
export async function createDepartment(req, res) {
  try {
    const { name, energyUsage, carbonFootprint } = req.body;
    const newDept = await Department.create({
      name,
      energyUsage,
      carbonFootprint,
    });
    res.status(201).json(newDept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a department by ID
export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all departments
export async function getAllDepartments(req, res) {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Generate report (optionally filtered by department IDs)
export async function generateReport(req, res) {
  try {
    const { ids } = req.query;
    const idArray = ids ? [].concat(ids) : [];
    let query = {};
    if (idArray.length) query._id = { $in: idArray };
    const departments = await Department.find(query);
    res.setHeader("Content-Disposition", "attachment; filename=report.json");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Compute averages for energy usage and carbon footprint
export async function getDepartmentAverages(req, res) {
  try {
    const departments = await Department.find();
    if (departments.length === 0) {
      return res.json({ avgEnergy: 0, avgCarbon: 0 });
    }
    const totalEnergy = departments.reduce((sum, d) => sum + d.energyUsage, 0);
    const totalCarbon = departments.reduce(
      (sum, d) => sum + d.carbonFootprint,
      0
    );
    const avgEnergy = totalEnergy / departments.length;
    const avgCarbon = totalCarbon / departments.length;
    res.json({ avgEnergy, avgCarbon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
