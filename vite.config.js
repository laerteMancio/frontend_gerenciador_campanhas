import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    // Variável de ambiente para o backend Vercel
    "process.env": {
      VITE_BACKEND_URL: "https://gerador-presell.vercel.app"
    }
  }
});
