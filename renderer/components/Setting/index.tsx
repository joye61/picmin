import style from "./index.module.scss";
import { RowCenter, RowEnd, RowStart } from "../Flex";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { Slider } from "../Slider";
import { Tab } from "../Tab";
import { type ModeType, scaleMenus, state } from "@/state";
import { useState } from "react";
import { Button } from "../Button";
import { observer } from "mobx-react-lite";
import { reCompress } from "@/utils";

export type Cstate = {
  mode: ModeType;
  percent: number;
  width?: string;
  height?: string;
  quality: number;
};

export interface SettingOption extends Cstate {
  onClose?: () => void;
  onApply?: (state: Cstate) => void;
}

export const Setting = observer((props: SettingOption) => {
  const { mode, percent, width, height, quality, onClose, onApply } = props;
  const [cstate, setCstate] = useState<Cstate>({
    mode,
    percent,
    width,
    height,
    quality,
  });

  const showModeItem = () => {
    if (cstate.mode === "percent") {
      return (
        <div className={style.item}>
          <RowStart className={style.title}>设置缩放比例</RowStart>
          <RowStart className={style.slider}>
            <div className={style.sliderBox}>
              <Slider
                value={cstate.percent}
                onChange={(percent) => {
                  setCstate({
                    ...cstate,
                    percent,
                  });
                }}
              />
            </div>
            <RowCenter>{Math.round(cstate.percent)}%</RowCenter>
          </RowStart>
        </div>
      );
    } else if (cstate.mode === "width") {
      return (
        <div className={style.item}>
          <RowStart className={style.title}>设置图片宽度</RowStart>
          <Input
            placeholder="设置宽度，高度自适应，最长6位"
            value={cstate.width}
            onChange={(width) => {
              setCstate({
                ...cstate,
                width,
              });
            }}
          />
        </div>
      );
    } else {
      return (
        <div className={style.item}>
          <RowStart className={style.title}>设置图片高度</RowStart>
          <Input
            placeholder="设置高度，宽度自适应，最长6位"
            value={cstate.height}
            onChange={(height) => {
              setCstate({
                ...cstate,
                height,
              });
            }}
          />
        </div>
      );
    }
  };

  const onReset = () => {
    cstate.mode = "percent";
    cstate.percent = 100;
    cstate.width = undefined;
    cstate.height = undefined;
    cstate.quality = 70;
    setCstate({ ...cstate });
  };

  return (
    <div className={style.box}>
      {/* 关闭按钮 */}
      <div
        className={style.close}
        onClick={() => {
          onClose?.();
        }}
      >
        <Icon type="close" />
      </div>

      <div className={style.item}>
        <RowStart className={style.title}>设置缩放模式</RowStart>
        <Tab
          list={scaleMenus}
          value={cstate.mode}
          onChange={(value) => {
            cstate.mode = value as ModeType;
            if (value === "percent") {
              cstate.width = undefined;
              cstate.height = undefined;
            } else if (value === "width") {
              cstate.percent = 100;
              cstate.height = undefined;
            } else {
              cstate.percent = 100;
              cstate.width = undefined;
            }
            setCstate({
              ...cstate,
            });
          }}
        />
      </div>

      {/* 调整缩放模式 */}
      {showModeItem()}

      {/* 调整输出质量质量 */}
      <div className={style.item} style={{ marginBottom: "10px" }}>
        <RowStart className={style.title}>输出图片质量</RowStart>
        <RowStart className={style.slider}>
          <div className={style.sliderBox}>
            <Slider
              value={cstate.quality}
              onChange={(quality) => {
                setCstate({
                  ...cstate,
                  quality,
                });
              }}
            />
          </div>
          <RowCenter>{Math.round(cstate.quality)}%</RowCenter>
        </RowStart>
      </div>

      <RowEnd className={style.btns}>
        <Button type="outline" onClick={onReset}>
          重置选项
        </Button>
        <Button onClick={() => onApply?.(cstate)}>立即应用</Button>
      </RowEnd>
    </div>
  );
});
