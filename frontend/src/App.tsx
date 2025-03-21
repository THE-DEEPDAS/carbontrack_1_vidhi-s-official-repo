import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import { Analysis } from "./pages/Analysis";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { OrgDashboard } from "./pages/organization/OrgDashboard";
import AdminLayout from "./layouts/AdminLayout";
import OrgLayout from "./layouts/OrgLayout";
import UserLayout from "./layouts/UserLayout";

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:5000/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser({
              id: data._id,
              email: data.email,
              role: data.role,
              organizationName: data.organizationName || null,
            });
          } else {
            // Token invalid or user fetch failed
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .catch(() => {
          // Network or token error
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      {/* Public nav for non-logged-in users */}
      {!user && (
        <nav className="bg-white shadow p-4 flex justify-end space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin protected routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* ...other nested admin routes can go here */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* Organization protected routes */}
        <Route path="/org/*" element={<OrgLayout />}>
          <Route index element={<OrgDashboard />} />
          {/* ...other nested organization routes can go here */}
          <Route path="*" element={<Navigate to="/org" replace />} />
        </Route>

        {/* User protected routes */}
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/analysis" element={<Analysis />} />
        </Route>

        {/* Default route - if logged in, redirect to appropriate dashboard */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : user.role === "organization" ? (
                <Navigate to="/org" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
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
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
