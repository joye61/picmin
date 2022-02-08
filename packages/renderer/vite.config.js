import { chrome } from "../../vendors.json";
import { join } from "path";
import { builtinModules } from "module";
import react from "@vitejs/plugin-react";

const PACKAGE_ROOT = __dirname;

export default {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "@/": join(PACKAGE_ROOT, "src") + "/",
      "@common/": join(PACKAGE_ROOT, "../common") + "/",
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [react()],
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: process.env.MODE === "development",
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE !== "development",
    rollupOptions: {
      input: "index.html",
      external: [...builtinModules.flatMap((p) => [p, `node:${p}`])],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};
