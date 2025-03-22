import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@babel/plugin-transform-runtime"],
      },
    }),
  ],
  define: {
    "process.env": {}, // Prevent `process` from being undefined
  },
  server: {
    host: true, // Allows access via localhost and network IP
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:5000", // Use environment variable
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
