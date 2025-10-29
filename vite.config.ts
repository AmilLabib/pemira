import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
  server: {
    // Temporary API Calls
    proxy: {
      "^/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
