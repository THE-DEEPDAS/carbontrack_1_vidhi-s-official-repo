import React, { useState, useEffect } from "react";
import axios from "axios";

function OrgManage() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [energyUsage, setEnergyUsage] = useState("");
  const [carbonFootprint, setCarbonFootprint] = useState("");
  const [selectedDeps, setSelectedDeps] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/departments", {
        name,
        energyUsage: Number(energyUsage),
        carbonFootprint: Number(carbonFootprint),
      });
      fetchDepartments();
      setName("");
      setEnergyUsage("");
      setCarbonFootprint("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportSelected = async () => {
    try {
      const query = selectedDeps.map((dep) => `ids=${dep}`).join("&");
      const res = await axios.get(`/api/departments/report?${query}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "departments_report.json");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manage Departments</h2>
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Energy Usage"
          type="number"
          value={energyUsage}
          onChange={(e) => setEnergyUsage(e.target.value)}
        />
        <input
          placeholder="Carbon Footprint"
          type="number"
          value={carbonFootprint}
          onChange={(e) => setCarbonFootprint(e.target.value)}
        />
        <button onClick={handleCreate}>Create Department</button>
      </div>
      <ul>
        {departments.map((dep) => (
          <li key={dep._id}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDeps([...selectedDeps, dep._id]);
                  } else {
                    setSelectedDeps(
                      selectedDeps.filter((id) => id !== dep._id)
                    );
                  }
                }}
              />
              {dep.name} - {dep.energyUsage} kWh - {dep.carbonFootprint} kg CO₂
            </label>
            <button onClick={() => handleDelete(dep._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleExportSelected}>Export Selected</button>
    </div>
  );
}

export default OrgManage;
