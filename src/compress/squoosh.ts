import { getNodeModulesPath, getTempDir } from "@/renderer/util";
import { spawn } from "child_process";
import path from "path";
import {
  assignNewWithOld,
  ensureOutputImageExits,
  getNewDimensionByScale,
} from "./function";

/**
 * 用squoosh压缩，压缩JPEG/JPG/WEBP/AVIF文件
 * @param item
 * @param option
 */
export async function compressBySquoosh(
  item: WaitingImageItem,
  option: CompressConfig
) {
  // 调用 Squoosh CLI 执行压缩
  try {
    const entry = getNodeModulesPath("@squoosh");
    const script = path.resolve(entry, "./cli/src/index.js");
    const options = getSquooshCliArguments(item, option);

    await new Promise<void>((resolve, reject) => {
      const squoosh = spawn(process.execPath, [script, ...options], {
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
        },
      });
      squoosh.on("exit", (event) => {
        console.log("Squoosh cli exited:", event);
        resolve();
      });
      // 如果启动进程报错，则任务失败
      squoosh.on("error", (event) => {
        console.log("Spawn squoosh cli failed:", event);
        reject();
      });
      // squoosh.stdout.on("data", (data) => {
      //   console.log(`stdout: ${data.toString("utf8")}`);
      // });

      // squoosh.stderr.on("data", (data) => {
      //   console.error(`stderr: ${data.toString("utf8")}`);
      // });
    });

    await ensureOutputImageExits(item);
  } catch (error) {
    console.log("Squoosh compression exception: ", error);
    // 压缩失败，使用旧的文件值直接替换，防止报错
    assignNewWithOld(item);
  }
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
  const ext = item.upperExtension;
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
  } else if (ext === "AVIF") {
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
