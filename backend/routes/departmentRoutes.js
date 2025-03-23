import express from "express";
const router = express.Router();

router.get("/departments", (req, res) => {
  res.json([
    {
      name: "Department 1",
      energyUsage: 1200,
      carbonFootprint: 800,
      logisticScore: 85,
    },
    {
      name: "Department 2",
      energyUsage: 2800,
      carbonFootprint: 1600,
      logisticScore: 90,
    },
  ]);
});

export default router;
