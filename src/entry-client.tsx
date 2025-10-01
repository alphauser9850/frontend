import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";

const container = document.getElementById("root");

const app = (
  <HelmetProvider>
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
  </HelmetProvider>
);

if (container?.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container!).render(app);
}
