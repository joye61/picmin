import style from "./index.module.scss";
import { ColCenter, RowCenter } from "../Flex";
import { Indicator } from "../Indicator";
import { state } from "@/state";

export function Loading() {
  const showMessage = () => {
    let message = "";
    if (state.isReadList) {
      message = "正在读取图片信息...";
    } else if (state.isSaving) {
      if (state.saveType === "alias") {
        return "正在以别名方式保存压缩图片...";
      } else if (state.saveType === "cover") {
        return "正在以覆盖源文件形式保存压缩图片...";
      } else if (state.saveType === "bundle") {
        return "正在生成压缩包...";
      }
    }
    return message;
  };

  if (state.isReadList || state.isSaving) {
    return (
      <ColCenter className={style.loading}>
        <Indicator size={20} height={5} />
        <RowCenter>{showMessage()}</RowCenter>
      </ColCenter>
    );
  }

  return null;
}
