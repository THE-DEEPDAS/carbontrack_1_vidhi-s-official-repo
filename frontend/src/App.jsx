import React, { useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Navbar } from "./components/Navbar";
import { AIAssistant } from "./components/AIAssistant";
import Dashboard from "./pages/Dashboard";
import  Monitoring  from "./pages/Monitoring.jsx";
import { Certificates } from "./pages/Certificates";
import { Analysis } from "./pages/Analysis";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";

const PrivateRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check for token and set initial user
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser(data);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/monitoring"
            element={
              <PrivateRoute>
                <Monitoring />
              </PrivateRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <PrivateRoute>
                <Certificates />
              </PrivateRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <PrivateRoute>
                <Analysis />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        <AIAssistant />
      </div>
    </Router>
  );
}

export default App;
