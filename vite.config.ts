import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    port: 3000, // use a common dev port
    host: "0.0.0.0", // accessible from LAN
    strictPort: true, // fail if port is taken
    proxy: {
      "/api": {
        target: "http://localhost:3001", // backend (HTTP now)
        changeOrigin: true,
      },
    },
  },
  build: {
    manifest: true,
    outDir: "dist/client",
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
});
