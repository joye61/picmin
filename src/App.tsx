import style from "./App.module.scss";
import { RowBetween, RowCenter, RowStart } from "./components/Flex";
import logo from "./assets/icon.svg";
import { Button, Typography, Space, Dropdown, Menu } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  ClearOutlined,
  SaveOutlined,
  ControlOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Content } from "./components/Content";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { saveMenus, SaveType, state } from "./renderer/state";
import { Setting } from "./components/Setting";
import {
  fsize,
  getExistsSets,
  isAddDisabled,
  isClearDisabled,
  isConfigDisabled,
  isRedoDisabled,
  isSaveDisabled,
} from "./renderer/util";
import { ipcRenderer } from "electron";
import { IPCEvents } from "./utils/const";
import { useMessage } from "./renderer/useMessage";
import { emptyImageList, invokeCompress, reCompress } from "./renderer/image";
import { SetEngine } from "./components/SetEngine";
import { Fsize } from "./components/Fsize";
import { Rate } from "./components/Rate";
import { toJS } from "mobx";
import { Indicator } from "./components/Indicator";

export const App = observer(() => {
  // 进程间通信处理用的专用hooks
  useMessage();

  // 按钮的禁用状态
  const clearDisabled = isClearDisabled();
  const saveDisabled = isSaveDisabled();
  const addDisabled = isAddDisabled();
  const configDisabled = isConfigDisabled();
  const redoDisabled = isRedoDisabled();

  return (
    <div className={style.container}>
      {/* 头部 */}
      <RowBetween className={style.header}>
        {/* logo */}
        <Space>
          <RowStart className={style.logo}>
            <img alt="" src={logo} />
            <Typography.Title level={5}>图小小</Typography.Title>
          </RowStart>
          <Button
            className={style.noDrag}
            icon={<SettingOutlined />}
            size="small"
            type="link"
            disabled={configDisabled}
            onClick={() => {
              state.showSetEngin = true;
            }}
          >
            设置引擎
          </Button>
          <Button
            className={style.noDrag}
            icon={<ControlOutlined />}
            size="small"
            type="link"
            disabled={configDisabled}
            onClick={() => {
              state.showSetting = true;
            }}
          >
            调整选项
          </Button>
          <Button
            size="small"
            type="link"
            className={clsx(style.redo, style.noDrag)}
            icon={<RedoOutlined />}
            disabled={redoDisabled}
            onClick={reCompress}
          >
            重新压缩
          </Button>
        </Space>

        {/* 退出逻辑 */}
        <Space className={style.action}>
          {state.sum.cnum !== state.list.length && (
            <RowStart className={style.processNum}>
              <Indicator />
              <Typography.Text type="warning">{state.sum.cnum}</Typography.Text>
              /
              <Typography.Text type="secondary">
                {state.list.length}
              </Typography.Text>
            </RowStart>
          )}
          <RowCenter
            className={clsx(style.mini, style.noDrag)}
            onClick={() => {
              ipcRenderer.send(IPCEvents.MiniApp);
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19,13H5V11H19V13Z" />
            </svg>
          </RowCenter>
          <RowCenter
            className={clsx(style.close, style.noDrag)}
            onClick={() => {
              ipcRenderer.send(IPCEvents.QuitApp);
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </RowCenter>
        </Space>
      </RowBetween>

      {/* 内容区 */}
      <div className={style.content}>
        <Content />
      </div>

      {/* 底部 */}
      <RowBetween className={style.footer}>
        {/* 信息展示 */}
        <RowStart className={style.helpInfo}>
          压缩前共
          <Fsize
            type="success"
            formats={fsize(state.sum.oldTotalSize, true) as [number, string]}
          />
          ，压缩后共
          <Fsize
            type="warning"
            formats={fsize(state.sum.newTotalSize, true) as [number, string]}
          />
          ，总体积
          <Rate
            oldSize={state.sum.oldTotalSize}
            newSize={state.sum.newTotalSize}
          />
        </RowStart>

        {/* 操作按钮 */}
        <Space className={style.noDrag}>
          <Button
            icon={<ClearOutlined />}
            disabled={clearDisabled}
            onClick={() => {
              if (clearDisabled) return;
              emptyImageList();
            }}
          >
            清空列表
          </Button>
          <Dropdown.Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={saveDisabled}
            onClick={() => {
              if (saveDisabled) return;
              // TODO
            }}
            overlay={
              <Menu
                onClick={({ key }) => {
                  state.saveType = key as SaveType;
                }}
              >
                {saveMenus.map((menu) => {
                  return <Menu.Item key={menu.value}>{menu.name}</Menu.Item>;
                })}
              </Menu>
            }
          >
            {saveMenus.find((menu) => menu.value === state.saveType)?.name}
          </Dropdown.Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={addDisabled}
            onClick={() => {
              if (addDisabled) return;
              ipcRenderer.send(IPCEvents.PickImages, getExistsSets());
            }}
          >
            添加图片
          </Button>
        </Space>
      </RowBetween>

      {/* 调整引擎 */}
      <SetEngine />
      {/* 设置框 */}
      <Setting />
    </div>
  );
});
