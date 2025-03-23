import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { FaShieldAlt, FaTachometerAlt, FaUsers, FaBuilding, FaSignOutAlt } from "react-icons/fa";

export const AdminNavbar = () => {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);
  
  // Only render for admin users
  if (user?.role !== "admin") return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Admin Panel with Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/admin" className="flex items-center">
              <span className="text-white text-2xl">
                <FaShieldAlt />
              </span>
              <span className="text-xl font-bold text-white ml-2">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Right Side: Navigation Links with Icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/admin"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/admin") && location.pathname === "/admin"
                  ? "bg-white text-purple-600 shadow-md"
                  : "text-white hover:bg-purple-500 hover:text-white"
              }`}
            >
              <span className="mr-2 text-lg">
                <FaTachometerAlt />
              </span>
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/admin/users")
                  ? "bg-white text-purple-600 shadow-md"
                  : "text-white hover:bg-purple-500 hover:text-white"
              }`}
            >
              <span className="mr-2 text-lg">
                <FaUsers />
              </span>
              Users
            </Link>
            <Link
              to="/admin/organizations"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive("/admin/organizations")
                  ? "bg-white text-purple-600 shadow-md"
                  : "text-white hover:bg-purple-500 hover:text-white"
              }`}
            >
              <span className="mr-2 text-lg">
                <FaBuilding />
              </span>
              Organizations
            </Link>
            <button
              onClick={signOut}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <span className="mr-2 text-lg">
                <FaSignOutAlt />
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};