import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Routes, Route, Navigate } from "react-router-dom";
import OrgData from "./OrgData";
import { OrgEmployees } from "./OrgEmployees";
import { OrgReports } from "./OrgReports";

export const OrgDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
    // Simulate historical trends (replace with API when available)
    const trends = [];
    for (let i = 5; i >= 0; i--) {
      trends.push({
        month: `Month ${i + 1}`,
        totalEnergy: Math.floor(1000 + Math.random() * 500),
        totalCarbon: Math.floor(500 + Math.random() * 300),
        totalLogistic: Math.floor(200 + Math.random() * 100),
      });
    }
    setHistoricalData(trends);
  }, []);

  // Sum current departments
  const totalEnergy = departments.reduce((sum, d) => sum + d.energyUsage, 0);
  const totalCarbon = departments.reduce(
    (sum, d) => sum + d.carbonFootprint,
    0
  );
  const totalLogistic = departments.reduce(
    (sum, d) => sum + (d.logisticScore || 0),
    0
  );

  const barDataEnergy = {
    labels: ["Total Energy"],
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: [totalEnergy],
        backgroundColor: "rgba(54,162,235,0.6)",
      },
    ],
  };

  const barDataCarbon = {
    labels: ["Total Carbon Footprint"],
    datasets: [
      {
        label: "Carbon Footprint (kg CO₂)",
        data: [totalCarbon],
        backgroundColor: "rgba(255,99,132,0.6)",
      },
    ],
  };

  const barDataLogistic = {
    labels: ["Total Logistic Score"],
    datasets: [
      {
        label: "Logistic",
        data: [totalLogistic],
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const lineDataHistorical = {
    labels: historicalData.map((t) => t.month),
    datasets: [
      {
        label: "Historical Energy Usage",
        data: historicalData.map((t) => t.totalEnergy),
        borderColor: "rgba(54,162,235,1)",
        fill: false,
      },
      {
        label: "Historical Carbon Footprint",
        data: historicalData.map((t) => t.totalCarbon),
        borderColor: "rgba(255,99,132,1)",
        fill: false,
      },
      {
        label: "Historical Logistic Score",
        data: historicalData.map((t) => t.totalLogistic),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Organization Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <Bar
            data={barDataEnergy}
            options={{
              plugins: { title: { display: true, text: "Total Energy Usage" } },
            }}
          />
        </div>
        <div>
          <Bar
            data={barDataCarbon}
            options={{
              plugins: {
                title: { display: true, text: "Total Carbon Footprint" },
              },
            }}
          />
        </div>
        <div>
          <Bar
            data={barDataLogistic}
            options={{
              plugins: {
                title: { display: true, text: "Total Logistic Score" },
              },
            }}
          />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Historical Trends</h2>
        <Line
          data={lineDataHistorical}
          options={{
            plugins: { title: { display: true, text: "Historical Trends" } },
          }}
        />
      </div>
      <Routes>
        <Route path="/" element={<OrgData />} />
        <Route path="/employees" element={<OrgEmployees />} />
        <Route path="/reports" element={<OrgReports />} />
        {/* Catch-all subroute */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default OrgDashboard;
