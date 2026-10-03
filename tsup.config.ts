import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom", "react/jsx-runtime"],
    // Every component is a client component (state, effects, event handlers).
    banner: { js: '"use client";' }
  },
  {
    entry: { styles: "src/styles/index.css" },
    minify: true
  }
]);
