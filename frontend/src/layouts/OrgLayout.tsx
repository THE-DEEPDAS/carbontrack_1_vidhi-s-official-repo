import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { OrgNavbar } from "../components/navbars/OrgNavbar";

const OrgLayout = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== "organization") return <Navigate to="/login" replace />;
  return (
    <>
      <OrgNavbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <Outlet />
      </div>
    </>
  );
};

export default OrgLayout;
