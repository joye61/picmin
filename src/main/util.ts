import { app } from "electron";
import fs from "fs-extra";
import { UID } from "./uid";
import path from "path";
import { TempDir } from "@/utils/const";

export function resetTemp() {
  const tempDir = app.getPath("temp");
  const tempPath = path.resolve(tempDir, TempDir);
  fs.rmSync(tempPath, {
    force: true,
    recursive: true,
  });
  fs.ensureDirSync(tempPath);
  UID.resetTemp();
}
