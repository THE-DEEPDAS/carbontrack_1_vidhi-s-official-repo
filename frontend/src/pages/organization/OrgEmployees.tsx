import React, { useState, useEffect } from "react";
import axios from "axios";

export const OrgEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");

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
      });
      setName("");
      setEnergyUsage("");
      setCarbonFootprint("");
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Department Management</h2>
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Energy Usage (kWh)"
          type="number"
          value={energyUsage}
          onChange={(e) => setEnergyUsage(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Carbon Footprint (kg CO₂)"
          type="number"
          value={carbonFootprint}
          onChange={(e) => setCarbonFootprint(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Department
        </button>
      </div>
      <table className="min-w-full border">
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
    </div>
  );
};
