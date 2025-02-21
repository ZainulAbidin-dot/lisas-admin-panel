import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Ensures correct asset paths
  build: {
    outDir: "dist", // Vercel serves from "dist"
    sourcemap: true, // Optional: Helps with debugging
  },
  server: {
    port: 5173, // Default Vite port
    open: true,
  },
});
