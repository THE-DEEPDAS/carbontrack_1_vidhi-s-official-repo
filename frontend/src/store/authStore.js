import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_URL = "http://localhost:5000/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem("token"),
      loading: true, // Initialize loading as true
      error: null,

      signUp: async (email, password, role, organizationName = null) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role, organizationName }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          set({ user: data.user, token: data.token, error: null, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signIn: async (email, password) => {
        set({ loading: true, error: null });
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
          set({ user: data.user, token: data.token, error: null, loading: false });

          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signOut: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, loading: false });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrating state:", state);
        if (state) {
          // Set loading to false only after rehydration is complete
          state.loading = false;
        }
      },
    }
  )
);