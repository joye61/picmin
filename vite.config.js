const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const path = require("path");

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./renderer")
    },
  },
  build: {
    outDir: "./dist/renderer",
  },
  server: {
    port: 4000,
  },
});
