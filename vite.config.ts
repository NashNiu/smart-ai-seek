import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3003,
    proxy: {
      "/apis": {
        target: "https://smartseek.ai-mchat.com/apis",
        // target: 'http://192.168.0.44:9998',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/apis/, "/"),
      },
    },
  },
});
