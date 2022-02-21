import { getNodeModulesPath, getTempDir } from "@/util";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import sizeOf from "probe-image-size";
import { assignNewWithOld, getNewDimensionByScale } from "./function";

/**
 * 用squoosh压缩，压缩JPEG/JPG/WEBP/AVIF文件
 * @param item
 * @param option
 */
export async function compressBySquoosh(
  item: WaitingImageItem,
  option: CompressConfig
) {
  const entry = await getNodeModulesPath("@squoosh");
  const script = path.resolve(entry, "./cli/src/index.js");
  const options = getSquooshCliArguments(item, option);

  // 压缩前先确保删除旧的临时文件
  fs.rmSync(item.tempPath, { force: true });

  // 调用 Squoosh CLI 执行压缩
  try {
    await new Promise<void>((resolve, reject) => {
      const squoosh = spawn(process.execPath, [script, ...options], {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
        },
      });
      // 如果启动进程报错，则任务失败
      squoosh.on("error", (event) => {
        console.log("Spawn squoosh cli failed:", event);
        reject();
      });
      // Squoosh CLI的输出在标准错误通道
      squoosh.stderr.on("data", (data: Buffer) => {
        const output = data.toString("utf8");
        console.log(`Squoosh stderr:`, data.toString("utf8"));
        if (/\√\s*Squoosh\s*results\:/.test(output)) {
          resolve();
        }
      });
      // 有正常输出的情况下，还要检查输出目录是否有文件生成，如果没有，则任务失败
      squoosh.stdout.on("data", (data: Buffer) => {
        console.log(`Squoosh stdout:`, data.toString("utf8"));
        resolve();
      });
    });

    // 检查目录中是否有输出文件
    if (fs.existsSync(item.tempPath)) {
      const stat = fs.lstatSync(item.tempPath);
      item.newSize = stat.size;
      // 读取图片文件的尺寸信息
      const { width, height } = await sizeOf(
        fs.createReadStream(item.tempPath)
      );
      item.newWidth = width;
      item.newHeight = height;
    } else {
      throw new Error("The compressed file does not exist");
    }
  } catch (error) {
    console.log("Unknown exception:", error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
  return item;
}

/**
 * 获取squoosh的调用参数
 * @param item
 * @param option
 */
export function getSquooshCliArguments(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // 最终的输出选项数组
  const options: string[] = [];

  // 拼接尺寸相关参数
  const { width, height } = getNewDimensionByScale(item, option.scale);
  if (width !== item.oldWidth) {
    options.push(
      "--resize",
      JSON.stringify({
        enabled: true,
        width,
        height,
        method: "lanczos3",
        fitMethod: "stretch",
        premultiply: true,
        linearRGB: true,
      })
    );
  }

  // 拼接质量参数
  const quality = option.quality;
  const ext = item.extension!.toUpperCase();
  if (ext === "JPG" || ext === "JPEG") {
    // 对于jpeg格式，quality取值0-100，值越小压缩率越高
    options.push(
      "--mozjpeg",
      JSON.stringify({
        quality,
        baseline: false,
        arithmetic: false,
        progressive: true,
        optimize_coding: true,
        smoothing: 0,
        color_space: 3,
        quant_table: 3,
        trellis_multipass: false,
        trellis_opt_zero: false,
        trellis_opt_table: false,
        trellis_loops: 1,
        auto_subsample: true,
        chroma_subsample: 2,
        separate_chroma_quality: false,
        chroma_quality: 75,
      })
    );
  } else if (ext === "WEBP") {
    // 对于webp格式，quality取值0-100，值越小压缩率越高
    options.push(
      "--webp",
      JSON.stringify({
        quality,
        target_size: 0,
        target_PSNR: 0,
        method: 4,
        sns_strength: 50,
        filter_strength: 60,
        filter_sharpness: 0,
        filter_type: 1,
        partitions: 0,
        segments: 4,
        pass: 1,
        show_compressed: 0,
        preprocessing: 0,
        autofilter: 0,
        partition_limit: 0,
        alpha_compression: 1,
        alpha_filtering: 1,
        alpha_quality: 100,
        lossless: 0,
        exact: 0,
        image_hint: 0,
        emulate_jpeg_size: 0,
        thread_level: 0,
        low_memory: 0,
        near_lossless: 100,
        use_delta_palette: 0,
        use_sharp_yuv: 0,
      })
    );
  } else if (ext === "avif") {
    // 对于avif格式，cqLevel取值0-63，值越大压缩率越高
    let fQuality = ((100 - quality) * 63) / 100;
    options.push(
      "--avif",
      JSON.stringify({
        cqLevel: fQuality,
        cqAlphaLevel: -1,
        subsample: 1,
        tileColsLog2: 0,
        tileRowsLog2: 0,
        speed: 6,
        chromaDeltaQ: false,
        sharpness: 0,
        denoiseLevel: 0,
        tune: 0,
      })
    );
  }

  // 设置文件后缀

  options.push("--suffix", "." + item.tempId);

  // 设置输出目录
  options.push("--output-dir", getTempDir());

  // 设置待压缩的文件
  options.push(item.path);

  return options;
}
