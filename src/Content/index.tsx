import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter, ColStart, RowBetween, RowCenter } from "../Flex";
import { CheckCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { RowType, state } from "../state";
import { Typography } from "antd";
import clsx from "clsx";
import { getSupportExtensionsAsString, readImagesFromPathList } from "../image";
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
      if (item.status === 1) {
        icon = <Indicator />;
      }
      return <div className={style.status}>{icon}</div>;
    },
  },
  {
    key: "name",
    title: "图片文件",
    className: style._name,
    render(item) {
      return (
        <div className={style.name}>
          <RowBetween>
            <Typography.Text>{item.name}</Typography.Text>
            <RowCenter
              onClick={() => {
                ipcRenderer.send(IPCEvents.LocateImage, item.path);
              }}
            >
              <img alt="" src={`file://${item.path}`} />
            </RowCenter>
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
  { key: "newSize", title: "新大小", className: style._newSize },
  { key: "rate", title: "压缩率", className: style._rate },
  { key: "action", title: "操作", className: style._action },
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
                return <th key={item.key}>{item.title}</th>;
              })}
            </tr>
          </thead>
        </table>
        <div className={style.list}>
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
      <FileImageOutlined className={style.icon} />
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
          let files: string[] = [];
          for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
              const file = event.dataTransfer.items[i].getAsFile()!;
              files.push(file.path);
            }
          }
          state.isReadList = true;
          await readImagesFromPathList(files);
        }}
      ></div>
    </ColCenter>
  );
}


export const Content = observer(() => {
  return <ColStart className={style.container}>{showContent()}</ColStart>;
});
