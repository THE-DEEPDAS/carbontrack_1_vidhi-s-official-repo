import React, { useState, useEffect } from "react";
import axios from "axios";

function OrgReports() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportAll = async () => {
    try {
      const res = await axios.get("/api/departments/report", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "all_departments_report.json");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Department Reports</h2>
      <button onClick={handleExportAll}>Export All Reports</button>
      <ul>
        {departments.map((dep) => (
          <li key={dep._id}>
            {dep.name} - {dep.energyUsage} kWh - {dep.carbonFootprint} kg CO₂
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrgReports;
