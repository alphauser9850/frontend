// server/proxy.js
import express from "express";
import compression from "compression";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  app.use(compression());

  if (!isProd) {
    // Development mode: use Vite middleware
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
        const { appHtml, helmetHead } = await vite.ssrLoadModule("/src/entry-server.tsx").then(mod =>
        mod.render(req.originalUrl)
      );

        const html = template
        .replace("<!--app-html-->", appHtml)
        .replace("<!--app-head-->", helmetHead);;
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    //Production mode: serve prebuilt assets
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
      render = () => ""; // fallback to client-only rendering
    }

   app.use(async (req, res, next) => {
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

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(
      ` SSR server running in ${isProd ? "production" : "development"} mode at http://localhost:${port}`
    );
  });
}

startServer();
