import { app } from "electron";
import fs from "fs-extra";
import { UID } from "../utils/uid";
import path from "path";
import { TempDirName } from "@/utils/const";

export function resetTemp() {
  const tempDir = app.getPath("temp");
  const tempPath = path.resolve(tempDir, TempDirName);
  fs.rmSync(tempPath, {
    force: true,
    recursive: true,
  });
  fs.ensureDirSync(tempPath);
  UID.reset();
}
