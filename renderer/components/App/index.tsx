import style from "./index.module.scss";
import { saveMenus, type SaveType, state, existSets } from "@/state";
import { RowBetween, RowStart, RowEnd, RowCenter } from "../Flex";
import { Indicator } from "../Indicator";
import { Button } from "../Button";
import { Setting } from "../Setting";
import { Icon } from "../Icon";
import clsx from "clsx";
import { fsize } from "@/utils";
import { Rate } from "../Rate";
import { Select } from "../Select";
import logo from "@/assets/logo.svg";
import { observer } from "mobx-react-lite";
import { useIpc, useWorker } from "@/ipc";
import { Content } from "../Content";

const { ipcRenderer } = require("electron");

export const App = observer(() => {
  useIpc();
  useWorker();

  const hasImageInProcessing = state.list.some((item) => item.status !== 1);
  const actionDisable =
    state.list.length === 0 ||
    state.isReadList ||
    state.isSaving ||
    hasImageInProcessing;

  const smenu = saveMenus.find((item) => item.key === state.saveType);
  const saveName = smenu?.value;
  return (
    <>
      <div className={style.container}>
        <RowBetween className={style.header}>
          <RowStart className={style.logo}>
            <img src={logo} />
            <span>图小小</span>
            {/* 显示当前的进度 */}
            {state.sum.cnum !== state.list.length && (
              <RowStart className={style.processNum}>
                <Indicator />
                <span>{state.sum.cnum}</span>/<span>{state.list.length}</span>
              </RowStart>
            )}
          </RowStart>
          <RowEnd>
            <Button
              disabled={actionDisable}
              icon="add"
              className={style.noDrag}
              type="link"
              onClick={() => ipcRenderer.send("PickImages", existSets)}
            >
              批量添加
            </Button>
            <Button
              disabled={actionDisable}
              icon="setting"
              className={style.noDrag}
              type="link"
              onClick={() => (state.showSetting = true)}
            >
              压缩选项
            </Button>
            <RowCenter
              className={clsx(style.mini, style.noDrag)}
              onClick={() => ipcRenderer.send("MiniApp")}
            >
              <Icon type="minus" />
            </RowCenter>
            <RowCenter
              className={clsx(style.close, style.noDrag)}
              onClick={() => ipcRenderer.send("QuitApp")}
            >
              <Icon type="close" />
            </RowCenter>
          </RowEnd>
        </RowBetween>
        <div className={style.content}>
          <Content />
        </div>
        <RowBetween className={style.footer}>
          <RowStart className={style.helpInfo}>
            共<span className={style.yellow}>{state.list.length}</span>
            张图片，压缩前
            <span className={style.green}>{fsize(state.sum.oldTotalSize)}</span>
            ，压缩后
            <span className={style.green}>{fsize(state.sum.oldTotalSize)}</span>
            ，总体积
            <Rate
              oldSize={state.sum.oldTotalSize}
              newSize={state.sum.newTotalSize}
            />
          </RowStart>
          <RowEnd className={style.btns}>
            <Button
              disabled={actionDisable}
              icon="clear"
              className={style.noDrag}
              type="outline"
            >
              清空列表
            </Button>
            <RowStart className={style.noDrag}>
              <Select
                options={saveMenus}
                value={state.saveType}
                onChange={(value) => (state.saveType = value as SaveType)}
                disabled={actionDisable}
                className={clsx(
                  style.saveBox,
                  actionDisable && style.saveOptionDisable
                )}
              >
                <Button disabled={actionDisable} icon="save" />
              </Select>
              <Button disabled={actionDisable}>{saveName}</Button>
            </RowStart>
            <Button
              disabled={actionDisable}
              icon="redo"
              className={style.noDrag}
            ></Button>
          </RowEnd>
        </RowBetween>
      </div>
      {/* 设置弹框 */}
      <Setting />
    </>
  );
});
