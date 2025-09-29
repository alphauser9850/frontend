import express from "express";
import compression from "compression";
import cors from "cors";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import router from "./routes/index.js";
import https from "https";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3001;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(compression());

  // API routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", router);

  // Vite dev server (only once)
  let vite;
  if (!isProd) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: 24678,
          host: "localhost",
          protocol: "wss",
        },
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
        },
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  // SSR middleware for non-API routes
  app.use(async (req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    try {
      if (!isProd) {
        // Dev SSR
        let template = await fsPromises.readFile(path.resolve(__dirname, "../index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
        const { appHtml, helmetHead } = await mod.render(req.originalUrl);
        const html = template.replace("<!--app-html-->", appHtml).replace("<!--app-head-->", helmetHead);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } else {
        // Production SSR
        const clientDist = path.resolve(__dirname, "../dist/client");
        const ssrDist = path.resolve(__dirname, "../dist/server/entry-server.js");
        app.use(express.static(clientDist, { index: false }));

        let render;
        try {
          const ssrModule = await import(pathToFileURL(ssrDist).href);
          render = ssrModule.render;
        } catch (err) {
          console.error(`Failed to load SSR bundle: ${ssrDist}`, err);
          render = () => ({ appHtml: "", helmetHead: "" });
        }

        const template = await fsPromises.readFile(path.resolve(clientDist, "index.html"), "utf-8");
        const { appHtml, helmetHead } = render(req.originalUrl);
        const html = template.replace("<!--app-html-->", appHtml).replace("<!--app-head-->", helmetHead);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      }
    } catch (err) {
      console.error(err);
      res.status(500).end("Internal Server Error");
    }
  });

  // Start HTTPS server in dev, plain HTTP in prod
  if (!isProd) {
    const httpsServer = https.createServer(
      {
        key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
      },
      app
    );
    httpsServer.listen(PORT, () => {
      console.log(`Dev server running at https://localhost:${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Production server running at http://localhost:${PORT}`);
    });
  }
}

startServer();
