import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserPlus } from "lucide-react";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, role, organizationName);
      navigate(
        role === "admin"
          ? "/admin"
          : role === "organization"
          ? "/org"
          : "/dashboard"
      );
    } catch (err: any) {
      console.error("Signup error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9] relative overflow-hidden">
      {/* Background with abstract shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#A5D6A7] opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#4CAF50] opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#81C784] opacity-20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphic Card with Thin White Border */}
      <div className="relative bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl shadow-lg p-8 w-96 max-w-full mx-4">
        {/* Header with Icon and Title */}
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-8 w-8 text-[#4CAF50]" />
          <h1 className="text-2xl font-bold ml-2 text-[#1A3C34]">Sign Up</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 bg-opacity-50 border border-red-400 border-opacity-50 text-red-700 px-4 py-3 rounded mb-6 backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label
              className="block text-[#1A3C34] text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-4 bg-white bg-opacity-20 border border-[#A5D6A7] rounded-lg text-[#1A3C34] placeholder-[#1A3C34] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              className="block text-[#1A3C34] text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-4 bg-white bg-opacity-20 border border-[#A5D6A7] rounded-lg text-[#1A3C34] placeholder-[#1A3C34] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Account Type Radio Buttons (Styled as Cards) */}
          <div className="mb-6">
            <label className="block text-[#1A3C34] text-sm font-bold mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* User Option */}
              <label
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  role === "user"
                    ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                    : "bg-white bg-opacity-20 border-[#A5D6A7] text-[#1A3C34] hover:bg-[#A5D6A7] hover:bg-opacity-30"
                }`}
              >
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <span className="text-sm font-medium">User</span>
              </label>

              {/* Organization Option */}
              <label
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  role === "organization"
                    ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                    : "bg-white bg-opacity-20 border-[#A5D6A7] text-[#1A3C34] hover:bg-[#A5D6A7] hover:bg-opacity-30"
                }`}
              >
                <input
                  type="radio"
                  value="organization"
                  checked={role === "organization"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <span className="text-sm font-medium">Organization</span>
              </label>

              {/* Admin Option */}
              <label
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  role === "admin"
                    ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                    : "bg-white bg-opacity-20 border-[#A5D6A7] text-[#1A3C34] hover:bg-[#A5D6A7] hover:bg-opacity-30"
                }`}
              >
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <span className="text-sm font-medium">Admin</span>
              </label>
            </div>
          </div>

          {/* Organization Name Input (Conditional) */}
          {role === "organization" && (
            <div className="mb-6">
              <label className="block text-[#1A3C34] text-sm font-bold mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full py-2 px-4 bg-white bg-opacity-20 border border-[#A5D6A7] rounded-lg text-[#1A3C34] placeholder-[#1A3C34] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all duration-300"
                placeholder="Enter organization name"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5D6A7] transition-all duration-300"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};