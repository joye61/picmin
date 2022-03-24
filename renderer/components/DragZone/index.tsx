import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { ColCenter } from "../Flex";
import { Icon } from "../Icon";
import { existSets } from "@/state";
import { getSupportExtensionsAsString } from "@/image";
import { useState } from "react";
import { handleFilesDrop } from "@/utils";

const { ipcRenderer } = require("electron");

export const DragZone = observer(() => {
  const [active, setActive] = useState(false);

  return (
    <ColCenter className={clsx(style.dragZone, active && style.dragActive)}>
      <Icon type="image" className={style.icon} />
      <h2>拖拽或选取要压缩的图片到这里</h2>
      <p>支持{getSupportExtensionsAsString()}格式</p>
      <div
        className={style.mask}
        onClick={() => ipcRenderer.send("PickImages", existSets)}
        onDragOver={(event) => {
          event.preventDefault();
          if (!active) {
            setActive(true);
          }
        }}
        onDragLeave={() => setActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setActive(false);
          handleFilesDrop(event);
        }}
      ></div>
    </ColCenter>
  );
});
