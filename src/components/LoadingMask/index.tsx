import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter, RowCenter } from "../Flex";
import { state } from "@/renderer/state";
import { Indicator } from "@/components/Indicator";

/**
 * 显示加载中状态
 */
export const LoadingMask = observer(() => {
  if (!state.isSaving) return null;

  const showMessage = () => {
    if (state.saveType === "alias") {
      return "正在以别名方式保存压缩图片...";
    }
    if (state.saveType === "cover") {
      return "正在以覆盖源文件形式保存压缩图片...";
    }
    if (state.saveType === "bundle") {
      return "正在生成压缩图打包...";
    }
  };

  return (
    <ColCenter className={style.loading}>
      <Indicator large />
      <RowCenter>{showMessage()}</RowCenter>
    </ColCenter>
  );
});
