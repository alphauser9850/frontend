import express from "express";
import compression from "compression";
import cors from "cors";
import fs from "fs/promises";
import fssync from "fs"; // 👈 sync version for https certs
import path from "path";
import https from "https";
import { fileURLToPath, pathToFileURL } from "url";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3001;

// Load HTTPS certs
const httpsOptions = {
  key: fssync.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
  cert: fssync.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
};

async function startServer() {
  const app = express();

  // Common middleware
  app.use(compression());
  app.use(cors());
  app.use(express.json());

  /** ------------------------
   * API ROUTES (Backend only)
   * ------------------------ */
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", router);

  /** ------------------------
   * SPECIFIC ROUTE HANDLERS
   * ------------------------ */
  // Ensure /deploy route is properly handled
  app.get("/deploy", (req, res, next) => {
    // Let the SSR handle this route
    next();
  });

  /** ------------------------
   * FRONTEND SSR HANDLING
   * ------------------------ */
  if (!isProd) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      try {
        let template = await fs.readFile(
          path.resolve(__dirname, "../index.html"),
          "utf-8"
        );

        template = await vite.transformIndexHtml(req.originalUrl, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const { appHtml, helmetHead } = await render(req.originalUrl);

        const html = template
          .replace("<!--app-html-->", appHtml)
          .replace("<!--app-head-->", helmetHead);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode: serve prebuilt assets
    const clientDist = path.resolve(__dirname, "../dist/client");
    const ssrDist = path.resolve(__dirname, "../dist/server/entry-server.js");

    app.use(express.static(clientDist, { index: false }));

    let render;
    try {
      const ssrModule = await import(pathToFileURL(ssrDist).href);
      render = ssrModule.render;
    } catch (err) {
      console.error(
        `Failed to load SSR bundle: ${ssrDist}\n` +
          `Did you forget to run "npm run build:server"?`
      );
      console.error(err);
      render = () => ({ appHtml: "", helmetHead: "" }); // fallback
    }

    app.use(async (req, res) => {
      try {
        const template = await fs.readFile(
          path.resolve(clientDist, "index.html"),
          "utf-8"
        );

        const { appHtml, helmetHead } = render(req.originalUrl);
        const html = template
          .replace("<!--app-html-->", appHtml)
          .replace("<!--app-head-->", helmetHead);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        console.error(e);
        res.status(500).end("Internal Server Error");
      }
    });
  }

  /** ------------------------
   * START SERVER (HTTPS)
   * ------------------------ */
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(
      `✅ HTTPS server running in ${isProd ? "production" : "development"} mode at https://localhost:${PORT}`
    );
  });
}

startServer();
