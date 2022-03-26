import style from "./index.module.scss";
import { RowCenter, RowEnd, RowStart } from "../Flex";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { Slider } from "../Slider";
import { Tab } from "../Tab";
import { type ModeType, scaleMenus, state } from "@/state";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button";
import { observer } from "mobx-react-lite";
import { reCompress } from "@/utils";

type Cstate = {
  mode: ModeType;
  percent: number;
  width?: string;
  height?: string;
  quality: number;
};

export const Setting = observer(() => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [animation, setAnimation] = useState<"show" | "hide">("show");

  useEffect(() => {
    if (!state.showSetting) {
      setAnimation("show");
    }
  }, [state.showSetting]);

  const [cstate, setCstate] = useState<Cstate>({
    mode: "percent",
    percent: 100,
    width: undefined,
    height: undefined,
    quality: 70,
  });

  let containerClass = style.container;
  let boxClass = style.box;
  if (animation === "show") {
    containerClass += ` ${style.containerShow}`;
    boxClass += ` ${style.boxShow}`;
  } else if (animation === "hide") {
    containerClass += ` ${style.containerHide}`;
    boxClass += ` ${style.boxHide}`;
  }

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

  const onApply = () => {
    state.mode = cstate.mode;
    state.percent = cstate.percent;
    state.width = cstate.width ? Number(cstate.width) : undefined;
    state.height = cstate.height ? Number(cstate.height) : undefined;
    state.quality = cstate.quality;
    // 关闭弹框
    setAnimation("hide");
    // 应用更新
    reCompress();
  };

  if (state.showSetting) {
    return (
      <div className={containerClass}>
        <div
          className={boxClass}
          ref={boxRef}
          onAnimationEnd={(event) => {
            if (event.animationName === style.BoxHide) {
              state.showSetting = false;
            }
          }}
        >
          {/* 关闭按钮 */}
          <div
            className={style.close}
            onClick={() => {
              setAnimation("hide");
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
            <Button onClick={onApply}>立即应用</Button>
          </RowEnd>
        </div>
      </div>
    );
  }

  return null;
});
