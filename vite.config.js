import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: "http://localhost:3000", // seu backend local
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            }
          : undefined, // no prod, não precisa de proxy
    },
  };
});
