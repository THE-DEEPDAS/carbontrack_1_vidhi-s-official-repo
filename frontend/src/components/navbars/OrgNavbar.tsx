import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const OrgNavbar = () => {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // Only render for organization users
  if (user?.role !== "organization") return null;

  // Use equality check for active route
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link to="/org/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                Organization Panel
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/org/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/org/dashboard")
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/org/employees"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/org/employees")
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              Employees
            </Link>
            <Link
              to="/org/reports"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/org/reports")
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              Reports
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
