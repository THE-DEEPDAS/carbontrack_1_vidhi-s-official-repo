import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Layout, Users, FileText, LogOut, Award, Menu, X } from "lucide-react"; // Added Menu and X icons

export const OrgNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // Only render for organization users
  if (user?.role !== "organization") return null;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/org/dashboard", icon: Layout, label: "Overview" },
    { path: "/org/employees", icon: Users, label: "Departments" },
    { path: "/org/reports", icon: FileText, label: "Reports" },
    { path: "/org/incentives", icon: Award, label: "Incentives" },
  ];

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/org/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-white">
                Organization Panel
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-gray-300 hover:text-white transition-colors duration-200 border-b-2 ${
                  isActive(item.path)
                    ? "border-white"
                    : "border-transparent hover:border-white"
                } py-5`}
              >
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-200 border-b-2 border-transparent hover:border-red-300 py-5"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 ${
                    isActive(item.path) ? "bg-gray-900" : ""
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default OrgNavbar;
