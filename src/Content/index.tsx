import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import {
  ColCenter,
  ColStart,
  RowBetween,
  RowCenter,
  RowEnd,
  RowStart,
} from "../Flex";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { RowType, state } from "../state";
import { Tooltip, Typography } from "antd";
import clsx from "clsx";
import { getSupportExtensionsAsString, addImagesFromPathList } from "../image";
import { fsize } from "@/util";
import { Indicator } from "@/Indicator";
import { LoadingMask } from "@/LoadingMask";
import { Fsize } from "@/Fsize";
import { ipcRenderer } from "electron";
import { IPCEvents } from "@/const";

interface ColType {
  key: keyof RowType;
  title: string;
  className?: string;
  render?(row: RowType): React.ReactNode;
}

const columns: ColType[] = [
  {
    key: "status",
    title: "状态",
    className: style._status,
    render(item) {
      let icon = <CheckCircleOutlined className={style.statusDone} />;
      if (item.status !== 0) {
        icon = <Indicator />;
      }
      return <div className={style.status}>{icon}</div>;
    },
  },
  {
    key: "name",
    title: "源图片",
    className: style._name,
    render(item) {
      return (
        <div className={style.name}>
          <RowBetween>
            <RowCenter
              onClick={() => {
                ipcRenderer.send(IPCEvents.LocateImage, item.path);
              }}
            >
              <img alt="" src={`file://${item.path}`} />
            </RowCenter>
            <Typography.Text>{item.name}</Typography.Text>
          </RowBetween>
        </div>
      );
    },
  },
  {
    key: "oldSize",
    title: "原大小",
    className: style._oldSize,
    render(item) {
      if (typeof item.oldSize === "number") {
        return <Fsize value={fsize(item.oldSize, true) as [number, string]} />;
      }
      return "-";
    },
  },
  {
    key: "newSize",
    title: "新大小",
    className: style._newSize,
    render(item) {
      if (typeof item.newSize === "number") {
        return <Fsize value={fsize(item.newSize, true) as [number, string]} />;
      }
      return "-";
    },
  },
  {
    key: "rate",
    title: "压缩率",
    className: style._rate,
    render(item) {
      if (
        typeof item.oldSize === "number" &&
        typeof item.newSize === "number"
      ) {
        let percent = ((item.newSize - item.oldSize) * 100) / item.oldSize;
        percent = Number(Math.abs(percent).toFixed(2));
        if (item.newSize <= item.oldSize) {
          return (
            <RowStart className={style.rateDown}>
              <ArrowDownOutlined />
              <Typography.Text>{percent}%</Typography.Text>
            </RowStart>
          );
        } else {
          return (
            <RowStart className={style.rateUp}>
              <ArrowUpOutlined />
              <Typography.Text>{percent}%</Typography.Text>
            </RowStart>
          );
        }
      }
      return "-";
    },
  },
  {
    key: "action",
    title: "操作",
    className: style._action,
    render() {
      return (
        <RowEnd className={style.action}>
          <Tooltip title="单图压缩转换" placement="left">
            <Typography.Text className={style.actionHandle}>
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14.68 13.25C13.45 14.15 12.54 15.47 12.18 17H6.5L9.25 13.47L11.21 15.83L13.96 12.29L14.68 13.25M5 19V5H19V12.03C19.7 12.09 20.38 12.24 21 12.5V5C21 3.9 20.11 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H12.5C12.24 20.38 12.09 19.7 12.03 19H5M22 18.5V14.5L20.83 15.67C20.11 14.95 19.11 14.5 18 14.5C15.79 14.5 14 16.29 14 18.5S15.79 22.5 18 22.5C19.68 22.5 21.12 21.47 21.71 20H20C19.54 20.61 18.82 21 18 21C16.62 21 15.5 19.88 15.5 18.5S16.62 16 18 16C18.69 16 19.32 16.28 19.77 16.73L18 18.5H22Z"
                />
              </svg>
            </Typography.Text>
          </Tooltip>
          <Typography.Text className={style.actionRemove}>
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
              />
            </svg>
          </Typography.Text>
        </RowEnd>
      );
    },
  },
];

function createColGroupByColumns() {
  return (
    <colgroup>
      {columns.map((item) => {
        return <col key={item.key} className={item.className} />;
      })}
    </colgroup>
  );
}

/**
 * 处理文件拖拽进入事件
 * @param event
 */
async function handleFilesDrop(event: React.DragEvent<HTMLDivElement>) {
  let files: string[] = [];
  for (let i = 0; i < event.dataTransfer.items.length; i++) {
    if (event.dataTransfer.items[i].kind === "file") {
      const file = event.dataTransfer.items[i].getAsFile()!;
      files.push(file.path);
    }
  }
  state.isReadList = true;
  await addImagesFromPathList(files);
}

/**
 * 显示内容区域的内容
 * @returns
 */
function showContent() {
  // 当数据存在时，创建列表
  if (state.list && state.list.length > 0) {
    const colGroup = createColGroupByColumns();
    const list = state.list.map((row) => {
      const cols = columns.map((col) => {
        let value: React.ReactNode = row[col.key];
        if (typeof col.render === "function") {
          value = col.render(row);
        }
        return <td key={col.key}>{value}</td>;
      });
      return <tr key={row.key}>{cols}</tr>;
    });

    return (
      <>
        <table className={style.ttitle}>
          {colGroup}
          <thead>
            <tr>
              {columns.map((item) => {
                return (
                  <th key={item.key} className={item.className}>
                    {item.title}
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
        <div
          className={style.list}
          onDragOver={(event) => {
            if (state.isReadList) return;
            event.preventDefault();
          }}
          onDragLeave={() => {
            if (state.isReadList) return;
            state.dragActive = false;
          }}
          onDrop={async (event) => {
            if (state.isReadList) return;
            event.preventDefault();
            await handleFilesDrop(event);
          }}
        >
          <table>
            {colGroup}
            <tbody>{list}</tbody>
          </table>
          <LoadingMask />
        </div>
      </>
    );
  }

  // 当数据不存在时，显示拖拽框
  return (
    <ColCenter
      className={clsx(style.dragZone, state.dragActive && style.dragActive)}
    >
      <svg className={style.icon} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M13.09 20H6L12 14L13.88 15.88C14.5 14.9 15.36 14.1 16.4 13.6L18 12V13.09C18.33 13.04 18.66 13 19 13C19.34 13 19.67 13.04 20 13.09V8L14 2H6C4.89 2 4 2.89 4 4V20C4 21.1 4.89 22 6 22H13.81C13.46 21.39 13.21 20.72 13.09 20M13 3.5L18.5 9H13V3.5M8 9C9.11 9 10 9.9 10 11S9.11 13 8 13 6 12.11 6 11 6.9 9 8 9M20 15V18H23V20H20V23H18V20H15V18H18V15H20Z"
        />
      </svg>
      <Typography.Title level={2}>
        拖拽或选取要压缩的图片到这里
      </Typography.Title>
      <p>支持{getSupportExtensionsAsString()}格式</p>
      <div
        className={style.mask}
        onClick={() => {
          ipcRenderer.send(IPCEvents.PickImages);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!state.dragActive) {
            state.dragActive = true;
          }
        }}
        onDragLeave={() => {
          state.dragActive = false;
        }}
        onDrop={async (event) => {
          event.preventDefault();
          state.dragActive = false;
          await handleFilesDrop(event);
        }}
      ></div>
    </ColCenter>
  );
}

export const Content = observer(() => {
  return <ColStart className={style.container}>{showContent()}</ColStart>;
});
