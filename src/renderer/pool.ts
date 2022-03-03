import EventEmitter from "events";

/**
 * 简单的线程池，解决卡顿问题
 * TO Verify
 */

interface PoolItem {
  isRunning: boolean;
  worker: Worker;
  id: string;
}
export class WorkerPool extends EventEmitter {
  static IDLE_EVENT = "pool_in_idle";
  pools: Record<string, PoolItem> = {};
  // 当前正在排队的任务数量
  waitN = 0;
  _inc = 0;

  constructor(private max: number = 5) {
    super();
  }

  private id(): string {
    if (this._inc > 1e10) {
      this._inc = 0;
    }
    this._inc += 1;
    return Date.now().toString(36) + this._inc;
  }

  async waitIdle(): Promise<string> {
    this.waitN += 1;
    return new Promise<string>((resolve) => {
      this.once(WorkerPool.IDLE_EVENT, (id: string) => {
        resolve(id);
      });
    });
  }

  setIdle(id: string) {
    const item = this.pools[id];
    if (item) {
      if (this.waitN > 0) {
        // 如果还有在排队的任务，设置空闲
        item.isRunning = false;
        this.emit(WorkerPool.IDLE_EVENT, id);
      } else {
        // 如果没有在排队的任务，直接销毁并删除
        item.worker.terminate();
        delete this.pools[id];
      }
    }
  }

  async getInstance(): Promise<PoolItem> {
    // // 检查是否有空闲worker，如果有直接返回
    // for (let id in this.pools) {
    //   const item = this.pools[id];
    //   if (item.isRunning) {
    //     return item;
    //   }
    // }

    // 检查是否允许生成新的worker
    if (Object.keys(this.pools).length < this.max) {
      const id = this.id();
      const item: PoolItem = {
        id,
        isRunning: false,
        worker: new Worker(new URL("./worker.ts", import.meta.url)),
      };
      this.pools[id] = item;
      return item;
    }

    // 到这里代表worker都在执行，必须等待池子有空闲
    const id = await this.waitIdle();
    this.waitN -= 1;
    return this.pools[id];
  }
}
