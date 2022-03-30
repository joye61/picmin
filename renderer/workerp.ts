import type { Sharp, SharpOptions } from "sharp";

// nodejs模块需要用require来加载
const sharp = require("sharp");

// 用于创建缩略图的worker
self.addEventListener("message", (event) => {
  createPreviewForList(event.data);
});

async function createPreviewForList(list: ImageItem[]) {
  for (let item of list) {
    // SVG文件直接生成Blob
    if (item.upperExtension === "SVG") {
      const resp = await fetch(`file://${item.path}`);
      const preview = await resp.blob();
      self.postMessage({
        path: item.path,
        preview,
      });
      continue;
    }

    // 其他图片类型通过sharp来压缩
    const options: SharpOptions = {};
    if (["GIF", "WebP", "AVIF"].includes(item.upperExtension)) {
      options.animated = true;
    }
    let pdata: Sharp = sharp(item.path, options).resize({
      width: 50,
      height: 50,
      fit: "cover",
    });

    // 由于TIFF格式不被支持，需要将TIFF转换为其他格式预览
    if (["TIF", "TIFF"].includes(item.upperExtension)) {
      pdata = pdata.jpeg();
    }
    const buf = await pdata.toBuffer();
    const preview = new Blob([new Uint8Array(buf)], { type: item.type });
    self.postMessage({
      path: item.path,
      preview,
    });
    pdata.destroy();
  }
}
