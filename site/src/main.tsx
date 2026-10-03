import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "flowpane/styles.css";
import { App } from "./App";
import { RouterProvider } from "./lib/router";
import "./site.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </StrictMode>
);
