import { useEffect } from "react";
import { state } from "./state";

export function useMessage() {
  useEffect(() => {
    window.PicMinMessage.onEmptyOver(() => {
      console.log(123, ":over");
      state.list = [];
    });
    window.PicMinMessage.onStatusUpdate((data: any) => {
      console.log(data); // TODO
    });
    return window.PicMinMessage.unListenAll;
  }, []);
}
