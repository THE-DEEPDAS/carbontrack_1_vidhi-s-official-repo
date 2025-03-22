import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:5000/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem("token"),
      loading: false,
      error: null,
      isFormComplete: false, // Track if the form is completed

      signUp: async (email, password, role, organizationName = null) => {
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role, organizationName }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          localStorage.setItem("token", data.token);
          set({ user: data.user, token: data.token, error: null });
          return data;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      signIn: async (email, password) => {
        try {
          console.log("Making API call to:", `${API_URL}/auth/login`);
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          console.log("API Response status:", response.status);
          const data = await response.json();
          console.log("API Response data:", data);

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Save token and user data to localStorage and state
          localStorage.setItem("token", data.token);
          set({ user: data.user, token: data.token, error: null });

          return data; // Return login data for redirection
        } catch (error) {
          console.error("Sign in error:", error);
          set({ error: error.message });
          throw error;
        }
      },

      fetchUserData: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");

          const response = await fetch(`${API_URL}/auth/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized. Please log in again.");
            }
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          console.log("User data fetched:", data);
          set({ user: data });
          return data;
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ error: error.message });
          throw error;
        }
      },

      signOut: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isFormComplete: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: localStorage,
    }
  )
);
