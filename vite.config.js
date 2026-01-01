import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  erver: {
    port: 3000,
    proxy: {
      "/": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
