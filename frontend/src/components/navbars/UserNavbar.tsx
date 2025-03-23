import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Menu, X } from "lucide-react"; // Added Menu and X icons for hamburger menu

export const UserNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // Only render for regular users
  if (user?.role !== "user") return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#1A3C34] bg-opacity-90 backdrop-blur-lg border border-[#1A3C34] border-opacity-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex space-x-4">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-[#E8F5E9]">
                CarbonTrack
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                isActive("/dashboard")
                  ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                  : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/monitoring"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                isActive("/monitoring")
                  ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                  : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
              }`}
            >
              Monitoring
            </Link>
            <Link
              to="/analysis"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                isActive("/analysis")
                  ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                  : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
              }`}
            >
              Analysis
            </Link>
            <Link
              to="/certificates"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                isActive("/certificates")
                  ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                  : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
              }`}
            >
              Certificates
            </Link>
            <button
              onClick={signOut}
              className="bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-[#388E3C] hover:bg-opacity-90 transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#E8F5E9] hover:text-[#A5D6A7] focus:outline-none"
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
            <div className="px-2 pt-2 pb-3 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                    : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/monitoring"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                  isActive("/monitoring")
                    ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                    : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
                }`}
              >
                Monitoring
              </Link>
              <Link
                to="/analysis"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                  isActive("/analysis")
                    ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                    : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
                }`}
              >
                Analysis
              </Link>
              <Link
                to="/certificates"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium text-[#E8F5E9] transition-all duration-300 ${
                  isActive("/certificates")
                    ? "bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white"
                    : "hover:bg-[#A5D6A7] hover:bg-opacity-20"
                }`}
              >
                Certificates
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white rounded-lg hover:bg-[#388E3C] hover:bg-opacity-90 transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};