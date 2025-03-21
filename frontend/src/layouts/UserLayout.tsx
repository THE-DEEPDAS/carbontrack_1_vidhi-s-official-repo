import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserNavbar } from "../components/navbars/UserNavbar";

const UserLayout = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== "user") {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
