import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { OrgSidebar } from "../../components/organization/OrgSidebar";
import { OrgEmployees } from "./OrgEmployees";
import { OrgReports } from "./OrgReports";

export const OrgDashboard = () => {
  return (
    <div className="flex">
      <OrgSidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<OrgOverview />} />
          <Route path="/employees" element={<OrgEmployees />} />
          <Route path="/reports" element={<OrgReports />} />
          {/* Catch-all subroute */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const OrgOverview = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Organization Dashboard</h1>
    {/* Add organization-specific content */}
  </div>
);
