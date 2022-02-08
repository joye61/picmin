interface Window {
    /** 处理渲染进程发送给主进程的消息 */
    readonly PicMin: { closeApp(): void; miniApp(): void; pickImages(): void; addImages(imageList: ImageItem[]): void; emptyImages(): void; };
    /** 处理渲主进程发送给渲染进程的消息 */
    readonly PicMinMessage: { onEmptyOver(callback: import("/Users/zhoujing/github.com/picmin/packages/preload/src/index").Callback): void; onStatusUpdate(callback: import("/Users/zhoujing/github.com/picmin/packages/preload/src/index").Callback): void; unListenAll(): void; };
}
