import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ThemeProvider } from "./theme/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

export function render(url: string) {
  const helmetContext: Record<string, any> = {};

  const app = (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ThemeProvider>
    </HelmetProvider>
  );

  const appHtml = renderToString(app);
  const { helmet } = helmetContext;

  return {
    appHtml,
    helmetHead: `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
    `,
  };
}