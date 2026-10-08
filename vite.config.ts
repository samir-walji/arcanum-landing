import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Read through globalThis so this file typechecks without @types/node.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};

export default defineConfig({
  // VITE_BASE is set by the GitHub Pages workflow ("/repo-name/"); locally it is "/".
  base: env.VITE_BASE ?? "/",
  plugins: [react()],
  build: {
    // The shaders engine is large. Hero.tsx lazy-loads it into its own chunk,
    // so the page shell paints first.
    chunkSizeWarningLimit: 2800,
  },
});
