import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: fromRoot("."),
  plugins: [react()],
  resolve: {
    // Examples import from "flowpane" exactly as users would; locally that resolves to the library source.
    alias: [
      { find: /^flowpane\/styles\.css$/, replacement: fromRoot("../src/styles/index.css") },
      { find: /^flowpane$/, replacement: fromRoot("../src/index.ts") }
    ]
  },
  build: {
    outDir: fromRoot("../site-dist"),
    emptyOutDir: true
  },
  server: { port: 5180 },
  preview: { port: 4180 }
});
