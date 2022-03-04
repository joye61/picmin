import { spawn, type SpawnOptionsWithoutStdio } from "child_process";

export interface SpawnMsg {
  execPath: string;
  args: string[];
  option?: SpawnOptionsWithoutStdio;
}

/**
 * 通过外部可执行文件进行压缩
 * @param msg
 * @returns
 */
export async function compressViaExec(msg: SpawnMsg) {
  // 调用可执行文件
  await new Promise<void>((resolve, reject) => {
    const exec = spawn(msg.execPath, msg.args, msg.option);
    exec.on("exit", (event) => {
      console.log(`${msg.execPath} exited: `, event);
      resolve();
    });
    exec.on("error", (event) => {
      console.error(`${msg.execPath} error: `, event);
      reject();
    });
  });

  return;
}
