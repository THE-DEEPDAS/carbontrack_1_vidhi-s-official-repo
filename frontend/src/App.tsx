import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import { Certificates } from "./pages/Certificates";
import { Analysis } from "./pages/Analysis";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrganizations } from "./pages/admin/AdminOrganizations";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { OrgDashboard } from "./pages/organization/OrgDashboard";
import { OrgEmployees } from "./pages/organization/OrgEmployees";
import { OrgReports } from "./pages/organization/OrgReports";
import IncentivesPage from "./pages/organization/incentives";
import AdminLayout from "./layouts/AdminLayout";
import OrgLayout from "./layouts/OrgLayout";
import UserLayout from "./layouts/UserLayout";
import Form from "./pages/Form";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"; // Use Vite's environment variable

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const fetchUserData = useAuthStore((state) => state.fetchUserData); // Ensure fetchUserData is imported correctly
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(`${API_URL}/auth/profile`) // Ensure fetchUserData is called with the correct API endpoint
        .then((userData) => {
          setUser(userData); // Update the user state with the fetched data
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [fetchUserData, setUser]);

  return (
    <BrowserRouter>
      {/* Public nav for non-logged-in users */}
      {!user && (
        <Navbar/>
      )}

      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin protected routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="organizations" element={<AdminOrganizations />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Organization protected routes */}
          <Route path="/org/*" element={<OrgLayout />}>
            <Route index element={<OrgDashboard />} />
            <Route path="employees" element={<OrgEmployees />} />
            <Route path="reports" element={<OrgReports />} />
            <Route path="incentives" element={<IncentivesPage />} />
            <Route path="*" element={<Navigate to="/org" replace />} />
          </Route>

          {/* User protected routes */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/certificates" element={<Certificates />} />
          </Route>

          {/* Default route */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : user.role === "organization" ? (
                  <Navigate to="/org" replace />
                ) : !isFormComplete ? (
                  <Form onComplete={() => setIsFormComplete(true)} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/signup" replace />
              )
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : user.role === "organization" ? (
                  <Navigate to="/org" replace />
                ) : !isFormComplete ? (
                  <Form onComplete={() => setIsFormComplete(true)} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
