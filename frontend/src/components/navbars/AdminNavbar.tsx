import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export const AdminNavbar = () => {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // Only render for admin users
  if (user?.role !== "admin") return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link to="/admin" className="flex items-center">
              <span className="text-xl font-bold text-purple-600">
                Admin Panel
              </span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin") && location.pathname === "/admin"
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-purple-100"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/admin/users"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin/users")
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-purple-100"
              }`}
            >
              Users
            </Link>
            <Link
              to="/admin/organizations"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/admin/organizations")
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-purple-100"
              }`}
            >
              Organizations
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
