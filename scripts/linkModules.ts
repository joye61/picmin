import fs from "fs";
import path from "path";

const srcNodeModulesPath = path.resolve(__dirname, "../src/node_modules");
const appNodeModulesPath = path.resolve(
  __dirname,
  "../release/app/node_modules"
);

if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(appNodeModulesPath)) {
  fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, "junction");
}
