import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/OrgReports.css";

export const OrgReports = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeps, setSelectedDeps] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("selectedDeps");
    if (stored) {
      setSelectedDeps(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedDeps", JSON.stringify(selectedDeps));
  }, [selectedDeps]);

  const fetchReports = async () => {
    try {
      // simulate false 2 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data); // Show all existing departments
    } catch (err) {
      console.error(
        "Error fetching reports:",
        err.response?.data || err.message
      );
      alert("Failed to fetch departments. Please try again.");
    }
  };

  const handleExport = async (ids = []) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in again.");
        return;
      }

      const query = ids.length ? ids.map((id) => `ids=${id}`).join("&") : "";
      const urlPath = query
        ? `/api/departments/report?${query}`
        : `/api/departments/report`;

      const res = await axios.get(urlPath, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      if (res.headers["content-type"] !== "application/json") {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          ids.length ? "selected_report.json" : "all_report.json"
        );
        document.body.appendChild(link);
        link.click();
      } else {
        const errorData = await res.data.text();
        console.error("Error exporting report:", errorData);
        alert("Failed to export report. Please try again.");
      }
    } catch (err) {
      console.error(
        "Error exporting report:",
        err.response?.data || err.message
      );
      alert("Failed to export report. Please try again.");
    }
  };

  const handlePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Departments Report", 14, 20);
    autoTable(doc, {
      head: [["Department", "Energy Usage (kWh)", "Carbon (kg CO₂)"]],
      body: departments.map((dep) => [
        dep.name,
        dep.energyUsage,
        dep.carbonFootprint,
      ]),
      startY: 30,
    });
    doc.save("report.pdf");
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => handleExport()}
          className="button button-primary mr-2"
        >
          Export All Reports
        </button>
        <button
          onClick={() => handleExport(selectedDeps)}
          disabled={selectedDeps.length === 0}
          className="button button-primary mr-2"
        >
          Export Selected Reports
        </button>
        <button onClick={handlePdf} className="button button-secondary">
          Generate PDF
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Energy Usage</th>
            <th>Carbon</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dep) => (
            <tr key={dep._id}>
              <td>
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
                  checked={selectedDeps.includes(dep._id)}
                />
              </td>
              <td>{dep.energyUsage}</td>
              <td>{dep.carbonFootprint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrgReports;
