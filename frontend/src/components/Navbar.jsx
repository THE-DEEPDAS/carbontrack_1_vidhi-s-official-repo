import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle

  return (
    <nav className="bg-[#1A3C34] bg-opacity-90 backdrop-blur-lg border border-[#1A3C34] border-opacity-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-[#E8F5E9]">
                CarbonTrack
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/login"
              className="bg-white bg-opacity-20 backdrop-blur-sm text-[#E8F5E9] px-4 py-2 rounded-lg hover:bg-[#A5D6A7] hover:bg-opacity-30 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] hover:bg-opacity-90 transition-all duration-300"
            >
              Sign Up
            </Link>
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
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-[#E8F5E9] rounded-lg hover:bg-[#A5D6A7] hover:bg-opacity-30 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 bg-[#4CAF50] bg-opacity-80 backdrop-blur-sm text-white rounded-lg hover:bg-[#388E3C] hover:bg-opacity-90 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;