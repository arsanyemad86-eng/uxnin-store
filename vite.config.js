import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: base must match the gh-pages repo name
// https://arsanyemad86-eng.github.io/uxnin-store/
export default defineConfig({
  plugins: [react()],
  base: "/uxnin-store/",
  build: {
    outDir: "dist",
    // Keep existing image folders (creatine/, whey-protein/, etc.) in dist
    // so we don't have to duplicate them into public/. Vite will only
    // overwrite index.html and the assets/ folder on each build.
    emptyOutDir: false,
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
});
