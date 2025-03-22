import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const OrgData = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments", err));
  }, []);

  // Bar chart data for all departments
  const barDataAll = {
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

  // Data for a selected department
  const dept = departments.find((d) => d._id === selectedDept);
  const barDataDept = {
    labels: ["Energy Usage", "Carbon Footprint"],
    datasets: [
      {
        label: dept ? dept.name : "",
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,99,132,0.6)"],
        data: dept ? [dept.energyUsage, dept.carbonFootprint] : [0, 0],
      },
    ],
  };

  // Pie chart data for all departments
  const totalEnergy = departments.reduce((sum, d) => sum + d.energyUsage, 0);
  const totalCarbon = departments.reduce(
    (sum, d) => sum + d.carbonFootprint,
    0
  );
  const pieDataAll = {
    labels: ["Total Energy Usage", "Total Carbon Footprint"],
    datasets: [
      {
        data: [totalEnergy, totalCarbon],
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,99,132,0.6)"],
      },
    ],
  };

  // Pie chart data for a selected department
  const pieDataDept = {
    labels: ["Energy Usage", "Carbon Footprint"],
    datasets: [
      {
        data: dept ? [dept.energyUsage, dept.carbonFootprint] : [0, 0],
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,99,132,0.6)"],
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Organization Data</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Department:</label>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border p-2"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Bar Chart</h2>
        {selectedDept === "all" ? (
          <Bar
            data={barDataAll}
            options={{
              plugins: {
                title: { display: true, text: "All Departments Data" },
              },
            }}
          />
        ) : (
          <Bar
            data={barDataDept}
            options={{
              plugins: {
                title: { display: true, text: `${dept ? dept.name : ""} Data` },
              },
            }}
          />
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Pie Chart</h2>
        {selectedDept === "all" ? (
          <Pie
            data={pieDataAll}
            options={{
              plugins: {
                title: { display: true, text: "All Departments Distribution" },
              },
            }}
          />
        ) : (
          <Pie
            data={pieDataDept}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: `${dept ? dept.name : ""} Distribution`,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrgData;
