import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

function Dashboard() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));
  }, []);

  const data = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        backgroundColor: "rgba(54,162,235,0.6)",
        data: departments.map((d) => d.energyUsage),
      },
      {
        label: "Carbon Footprint (kg CO₂)",
        backgroundColor: "rgba(255,99,132,0.6)",
        data: departments.map((d) => d.carbonFootprint),
      },
    ],
  };

  return (
    <div>
      <h2>Department Energy & Carbon Overview</h2>
      <Bar data={data} />
    </div>
  );
}

export default Dashboard;
