import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimizeDeps: {
      exclude: ["lucide-react"], // prevent too many files open / SSR issues
    },
    server: isDev
      ? {
          host: "0.0.0.0",
          port: 3443, // match proxy.js
          strictPort: true,
          https: {
            key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
            cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
          },
          hmr: {
            port: 24678,
            host: "localhost",
            protocol: "wss",
          },
        }
      : undefined,
    build: {
      manifest: true,
      outDir: "dist/client",
    },
    ssr: {
      noExternal: ["react-helmet-async", "lucide-react"], // add SSR-incompatible libs here
    },
  };
});
