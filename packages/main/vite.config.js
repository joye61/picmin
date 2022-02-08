import { node } from "../../vendors.json";
import { join } from "path";
import { builtinModules } from "module";

const PACKAGE_ROOT = __dirname;

export default {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      "@/": join(PACKAGE_ROOT, "src") + "/",
      "@common/": join(PACKAGE_ROOT, "../common") + "/",
    },
  },
  build: {
    sourcemap: process.env.MODE === "development",
    target: `node${node}`,
    outDir: "dist",
    assetsDir: ".",
    minify: false,
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        ...builtinModules.flatMap((p) => [p, `node:${p}`]),
      ],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};
