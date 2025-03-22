import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { OrgEmployees } from "./OrgEmployees";
import { OrgReports } from "./OrgReports";

export const OrgDashboard = () => {
  return (
    <div className="p-8">
      {/* Navigation is now handled by OrgNavbar (set in OrgLayout) */}
      <Routes>
        <Route path="/" element={<OrgOverview />} />
        <Route path="/employees" element={<OrgEmployees />} />
        <Route path="/reports" element={<OrgReports />} />
        {/* Catch-all subroute */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const OrgOverview = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Organization Overview</h1>
    <p>
      Welcome to the Organization Dashboard. Use the navbar to manage
      departments and generate reports.
    </p>
    {/* Additional charts or summaries can be added here */}
  </div>
);
