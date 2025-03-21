import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { AdminNavbar } from "../components/navbars/AdminNavbar";

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
