import React, { useState, useEffect } from "react";
import axios from "axios";

export const OrgReports = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeps, setSelectedDeps] = useState<string[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const handleExport = async () => {
    try {
      const query = selectedDeps.length
        ? selectedDeps.map((id) => `ids=${id}`).join("&")
        : "";
      const urlPath = query
        ? `/api/departments/report?${query}`
        : `/api/departments/report`;
      const res = await axios.get(urlPath, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedDeps.length ? "selected_report.json" : "all_report.json"
      );
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error exporting report:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Department Reports</h2>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Export Report
      </button>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="p-2 border">Select</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Energy Usage</th>
            <th className="p-2 border">Carbon Footprint</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep._id}>
              <td className="p-2 border text-center">
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
              </td>
              <td className="p-2 border">{dep.name}</td>
              <td className="p-2 border">{dep.energyUsage}</td>
              <td className="p-2 border">{dep.carbonFootprint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
