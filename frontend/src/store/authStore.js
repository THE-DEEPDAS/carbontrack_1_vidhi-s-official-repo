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
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message);
          }

          localStorage.setItem("token", data.token);
          set({ user: data.user, token: data.token, error: null });

          // Fetch user profile to check if the form is completed
          const profileResponse = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          });
          const profileData = await profileResponse.json();
          set({ isFormComplete: profileData.isFormComplete || false });

          return data; // Return the user and token
        } catch (error) {
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
