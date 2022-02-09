import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter } from "../Flex";
import { state } from "../state";
import React from "react";
import { Indicator } from "@/Indicator";

/**
 * 显示加载中状态
 */
export const LoadingMask = observer(() => {
  if (!state.isReadList) return null;
  return (
    <ColCenter className={style.loading}>
      <Indicator large />
      <p>正在读取图片列表...</p>
    </ColCenter>
  );
});
