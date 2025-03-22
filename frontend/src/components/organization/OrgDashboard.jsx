import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function OrgDashboard() {
  const [departments, setDepartments] = useState([]);
  const [averages, setAverages] = useState({ avgEnergy: 0, avgCarbon: 0 });
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
    axios
      .get("/api/departments/averages")
      .then((res) => setAverages(res.data))
      .catch((err) => console.error("Error fetching averages:", err));
  }, []);

  const energyData = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        backgroundColor: "rgba(54,162,235,0.6)",
        data: departments.map((d) => d.energyUsage),
      },
      {
        label: "Average Energy Usage",
        backgroundColor: "rgba(54,162,235,0.3)",
        data: departments.map(() => averages.avgEnergy),
      },
    ],
  };

  const carbonData = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        label: "Carbon Footprint (kg CO₂)",
        backgroundColor: "rgba(255,99,132,0.6)",
        data: departments.map((d) => d.carbonFootprint),
      },
      {
        label: "Average Carbon Footprint",
        backgroundColor: "rgba(255,99,132,0.3)",
        data: departments.map(() => averages.avgCarbon),
      },
    ],
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-8">Organization Dashboard</h2>
      <nav className="space-y-2">
        <Link to="/org" className="block p-2 hover:bg-gray-700 rounded">
          Overview
        </Link>
        <Link
          to="/org/employees"
          className="block p-2 hover:bg-gray-700 rounded"
        >
          Employees
        </Link>
        <Link to="/org/reports" className="block p-2 hover:bg-gray-700 rounded">
          Reports
        </Link>
        <button
          onClick={signOut}
          className="w-full text-left p-2 hover:bg-gray-700 rounded mt-8 text-red-400"
        >
          Sign Out
        </button>
      </nav>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Organization Dashboard</h2>
        <div className="mb-8">
          <Bar
            data={energyData}
            options={{
              plugins: {
                title: { display: true, text: "Energy Usage vs Average" },
              },
            }}
          />
        </div>
        <div>
          <Bar
            data={carbonData}
            options={{
              plugins: {
                title: { display: true, text: "Carbon Footprint vs Average" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default OrgDashboard;
