import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import https from "https";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3443;

// ----------------------
// Middleware
// ----------------------
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api", router);

// ----------------------
// Vite Dev Server + SSR
// ----------------------
(async () => {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
      },
      hmr: { protocol: "wss", host: "localhost", port: 24678 },
    },
    appType: "custom",
  });

  // Vite middleware
  app.use(vite.middlewares);

  // SSR middleware for all non-API routes
  app.use(async (req, res) => {
    if (req.path.startsWith("/api")) return;

    try {
      let template = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
      template = await vite.transformIndexHtml(req.originalUrl, template);

      const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { appHtml, helmetHead } = await mod.render(req.originalUrl);

      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace("<!--app-head-->", helmetHead);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error("SSR Error:", err);
      res.status(500).end("SSR Error");
    }
  });

  // Start HTTPS server
  https.createServer(
    {
      key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
    },
    app
  ).listen(PORT, () => console.log(`Dev server running at https://localhost:${PORT}`));
})();
