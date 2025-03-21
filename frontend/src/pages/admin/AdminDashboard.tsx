import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminUsers } from "./AdminUsers";
import { AdminOrganizations } from "./AdminOrganizations";
import { AdminSidebar } from "../../components/admin/AdminSidebar";

export const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/organizations" element={<AdminOrganizations />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminOverview = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Admin Overview</h1>
    <div className="grid grid-cols-3 gap-4">
      {/* Add admin statistics and controls */}
    </div>
  </div>
);
