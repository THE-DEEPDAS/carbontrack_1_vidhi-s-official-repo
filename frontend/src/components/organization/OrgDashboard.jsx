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
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    console.log("OrgDashboard mounted");
    axios
      .get("/api/departments")
      .then((res) => {
        console.log("Departments fetched:", res.data);
        setDepartments(res.data);
      })
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const energyData = {
    labels: departments.map((d) => d.name),
    datasets: [
      {
        label: "Energy Usage (kWh)",
        backgroundColor: "rgba(54,162,235,0.6)",
        data: departments.map((d) => d.energyUsage),
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
        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
        <p>This is the dashboard for departments.</p>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Energy Usage vs Average</h2>
          <Bar
            data={energyData}
            options={{
              plugins: {
                title: { display: true, text: "Energy Usage vs Average" },
              },
            }}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Carbon Footprint vs Average</h2>
          <Bar
            data={carbonData}
            options={{
              plugins: {
                title: { display: true, text: "Carbon Footprint vs Average" },
              },
            }}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Raw Department Data</h2>
          <pre className="text-xs bg-gray-100 p-2">
            {JSON.stringify(departments, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default OrgDashboard;
