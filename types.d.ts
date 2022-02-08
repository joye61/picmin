/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />


interface File {
  path: string;
}

type IPCEventHandler = (event: IpcMainEvent, ...args: any[]) => void;