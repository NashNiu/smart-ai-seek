import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 3003,
    proxy: {
      '/apis': {
        target: 'http://172.16.0.24:50000/',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/apis/, '')
    }
    }
  },
});

