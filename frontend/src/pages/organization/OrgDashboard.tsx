import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrgData from "./OrgData";
import { OrgEmployees } from "./OrgEmployees";
import { OrgReports } from "./OrgReports";

export const OrgDashboard = () => {
  return (
    <div className="p-8">
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
