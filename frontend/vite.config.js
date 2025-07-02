import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona requisições /business para /
      "/business": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace(/^\/business/, ""),
        changeOrigin: true,
      },
    },
  },
});
