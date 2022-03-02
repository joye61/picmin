import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter, RowCenter } from "../Flex";
import { state } from "@/renderer/state";
import { Indicator } from "@/components/Indicator";

/**
 * 显示加载中状态
 */
export const LoadingMask = observer(() => {
  if (!state.isReadList) return null;

  const showNum = () => {
    if (state.readTotal > 0) {
      return (
        <>
          ：
          <div className={style.num}>
            <span>{state.readCurrent}</span>/<span>{state.readTotal}</span>
          </div>
        </>
      );
    }
  };

  return (
    <ColCenter className={style.loading}>
      <Indicator large />
      <RowCenter>正在读取并验证图片列表{showNum()}</RowCenter>
    </ColCenter>
  );
});
