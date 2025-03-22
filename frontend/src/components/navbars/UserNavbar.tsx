import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const UserNavbar = () => {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // Only render for regular users
  if (user?.role !== "user") return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-green-600">
                CarbonTrack
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-green-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/monitoring"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/monitoring")
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-green-100"
              }`}
            >
              Monitoring
            </Link>
            <Link
              to="/analysis"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/analysis")
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-green-100"
              }`}
            >
              Analysis
            </Link>
            <Link
              to="/certificates"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/certificates")
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-green-100"
              }`}
            >
              Certificates
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
