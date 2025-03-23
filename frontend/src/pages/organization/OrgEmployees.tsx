import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export const OrgEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [selectedDept, setSelectedDept] = useState("none");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched in OrgEmployees:", res.data); // Debug log
      setDepartments(res.data); // Update with all departments
    } catch (err) {
      console.error("Error fetching departments:", err.response?.data || err.message);
      alert("Failed to fetch departments.");
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!name || !energyUsage || !carbonFootprint) {
        alert("All fields are required");
        return;
      }

      const res = await axios.post(
        "/api/departments",
        { name, energyUsage: Number(energyUsage), carbonFootprint: Number(carbonFootprint) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Department created successfully:", res.data); // Debug log
      setDepartments((prev) => [...prev, res.data]); // Add the new department to the list
      setName("");
      setEnergyUsage("");
      setCarbonFootprint("");
    } catch (err) {
      console.error("Error creating department:", err.response?.data || err.message);
      alert("Failed to create department.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDepartments();
    } catch (err) {
      console.error("Error deleting department:", err);
      alert("Failed to delete department.");
    }
  };

  // Leaderboards sorted descending by each metric
  const leaderboardEnergy = [...departments]
    .sort((a, b) => b.energyUsage - a.energyUsage)
    .slice(0, 5);
  const leaderboardCarbon = [...departments]
    .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
    .slice(0, 5);

  // Individual department graph; shown when a department is selected (dropdown value not "none")
  const selectedDepartment = departments.find((d) => d._id === selectedDept);
  const individualBarData = {
    labels: ["Energy Usage (kWh)", "Carbon Footprint (kg CO₂)"],
    datasets: [
      {
        label: selectedDepartment ? selectedDepartment.name : "",
        data: selectedDepartment
          ? [selectedDepartment.energyUsage, selectedDepartment.carbonFootprint]
          : [0, 0],
        backgroundColor: ["rgba(54,162,235,0.6)", "rgba(255,99,132,0.6)"],
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
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep._id}>
              <td className="p-2 border">{dep.name}</td>
              <td className="p-2 border">{dep.energyUsage}</td>
              <td className="p-2 border">{dep.carbonFootprint}</td>
              <td className="p-2 border">
                <button
                  onClick={() => {
                    console.log("Deleting department with ID:", dep._id); // Debug log
                    handleDelete(dep._id);
                  }}
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
      <div className="mb-8 grid grid-cols-2 gap-4">
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
