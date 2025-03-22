import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export const OrgEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [logisticScore, setLogisticScore] = useState(""); // New optional field
  const [selectedDept, setSelectedDept] = useState("none");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/departments", {
        name,
        energyUsage: Number(energyUsage),
        carbonFootprint: Number(carbonFootprint),
        logisticScore: logisticScore ? Number(logisticScore) : 0,
      });
      setName("");
      setEnergyUsage("");
      setCarbonFootprint("");
      setLogisticScore("");
      fetchDepartments();
    } catch (err) {
      console.error("Error creating department:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  // Leaderboards sorted descending by each metric
  const leaderboardEnergy = [...departments]
    .sort((a, b) => b.energyUsage - a.energyUsage)
    .slice(0, 5);
  const leaderboardCarbon = [...departments]
    .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
    .slice(0, 5);
  const leaderboardLogistic = [...departments]
    .sort((a, b) => (b.logisticScore || 0) - (a.logisticScore || 0))
    .slice(0, 5);

  // Individual department graph; shown when a department is selected (dropdown value not "none")
  const selectedDepartment = departments.find((d) => d._id === selectedDept);
  const individualBarData = {
    labels: [
      "Energy Usage (kWh)",
      "Carbon Footprint (kg CO₂)",
      "Logistic Score",
    ],
    datasets: [
      {
        label: selectedDepartment ? selectedDepartment.name : "",
        data: selectedDepartment
          ? [
              selectedDepartment.energyUsage,
              selectedDepartment.carbonFootprint,
              selectedDepartment.logisticScore || 0,
            ]
          : [0, 0, 0],
        backgroundColor: [
          "rgba(54,162,235,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(75,192,192,0.6)",
        ],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Department Management</h2>
      {/* Department Creation Form */}
      <div className="mb-4 space-x-2">
        <input
          className="border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Energy Usage (kWh)"
          type="number"
          value={energyUsage}
          onChange={(e) => setEnergyUsage(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Carbon Footprint (kg CO₂)"
          type="number"
          value={carbonFootprint}
          onChange={(e) => setCarbonFootprint(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Logistic Score (optional)"
          type="number"
          value={logisticScore}
          onChange={(e) => setLogisticScore(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Department
        </button>
      </div>
      {/* Departments List */}
      <table className="min-w-full border mb-8">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Energy Usage</th>
            <th className="p-2 border">Carbon Footprint</th>
            <th className="p-2 border">Logistic</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep._id}>
              <td className="p-2 border">{dep.name}</td>
              <td className="p-2 border">{dep.energyUsage}</td>
              <td className="p-2 border">{dep.carbonFootprint}</td>
              <td className="p-2 border">{dep.logisticScore || "-"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(dep._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Leaderboard Section */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Top Energy Usage</h3>
          <ol>
            {leaderboardEnergy.map((dep) => (
              <li key={dep._id}>
                {dep.name}: {dep.energyUsage} kWh
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Top Carbon Footprint</h3>
          <ol>
            {leaderboardCarbon.map((dep) => (
              <li key={dep._id}>
                {dep.name}: {dep.carbonFootprint} kg CO₂
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Top Logistic Score</h3>
          <ol>
            {leaderboardLogistic.map((dep) => (
              <li key={dep._id}>
                {dep.name}: {dep.logisticScore || "-"}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Individual Department Graph Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Department Graph</h2>
        <div className="mb-2">
          <label className="mr-2 font-semibold">
            Select Department for Graph:
          </label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border p-2"
          >
            <option value="none">-- Select Department --</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        {selectedDept !== "none" && (
          <Bar
            data={individualBarData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: selectedDepartment
                    ? `${selectedDepartment.name} Metrics`
                    : "",
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrgEmployees;
