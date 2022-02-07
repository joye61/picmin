import rimraf from "rimraf";
import path from "path";

const files: string[] = [
  path.resolve(__dirname, "../release/app/dist/main"),
  path.resolve(__dirname, "../release/app/dist/renderer"),
  path.resolve(__dirname, "../release/build"),
];
files.forEach((file) => {
  rimraf.sync(file);
});
