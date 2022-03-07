import { compress, type CompressOption } from "@/compress";
import { type EngineMap } from "@/compress/define";
import path from "path";
import fs from "fs-extra";

const option: CompressOption = {
  quality: 75,
  mode: "percent",
  percent: 75,
};

const engine: EngineMap = {
  apng: "upng",
  avif: "avif",
  gif: "gifsicle",
  jpeg: "canvas",
  png: "upng",
  svg: "svgo",
  webp: "canvas",
};

// 非法的文件作为图片传参会抛出异常
test("Not a legal image type throws an exception", async () => {
  const invalidImage = path.resolve(__dirname, "./assets/test.txt");
  await expect(compress(invalidImage, option, engine)).rejects.toThrow();
});

/**
 * 根据文件名获取文件完整路径
 * @param name
 * @returns
 */
function image(name: string) {
  return path.resolve(__dirname, "assets", name);
}

/**
 * 测试压缩逻辑
 * @param file
 */
async function testCompress(file: string) {
  const result = await compress(file, option, engine);
  const exists = fs.existsSync(result.tempPath);
  // 输出文件存在，压缩成功
  if (exists) {
    expect(result.fail).toBe(false);
  }
  // 输出文件不存在，压缩失败
  else {
    expect(result.fail).toBe(true);
  }
}

const assets = {
  // apng类型，支持动画
  apng: image("test.a.png"),
  avif: image("test.avif"),
  jpeg: image("test.jpeg"),
  jpg: image("test.jpg"),
  gif: image("test.gif"),
  png: image("test.png"),
  svg: image("test.svg"),
  webp: image("test.webp"),
};

test(`Testing the compression function for ${assets.apng}`, async () => {
  await testCompress(assets.apng);
});
test(`Testing the compression function for ${assets.avif}`, async () => {
  await testCompress(assets.avif);
});
test(`Testing the compression function for ${assets.jpeg}`, async () => {
  await testCompress(assets.jpeg);
});
test(`Testing the compression function for ${assets.jpg}`, async () => {
  await testCompress(assets.jpg);
});
test(`Testing the compression function for ${assets.gif}`, async () => {
  await testCompress(assets.gif);
});
test(`Testing the compression function for ${assets.png}`, async () => {
  await testCompress(assets.png);
});
test(`Testing the compression function for ${assets.svg}`, async () => {
  await testCompress(assets.svg);
});
test(`Testing the compression function for ${assets.webp}`, async () => {
  await testCompress(assets.webp);
});