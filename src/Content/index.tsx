import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter, ColStart, RowBetween, RowCenter } from "../Flex";
import { CheckCircleOutlined, FileImageOutlined } from "@ant-design/icons";
import { RowType, state } from "../state";
import { Tooltip, Typography } from "antd";
import clsx from "clsx";
import { getSupportExtensionsAsString } from "../image";
import { fsize } from "@/util";
import { Indicator } from "@/Indicator";
import { LoadingMask } from "@/LoadingMask";
import { Fsize } from "@/Fsize";

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
    title: "图片名称",
    className: style._name,
    render(item) {
      return (
        <div className={style.name}>
          <RowBetween>
            <Typography.Text>{item.name}</Typography.Text>
            <Tooltip title="打开当前图片所在位置">
              <RowCenter
                onClick={() => {
                  // window.PicMin.locateImage(item.path);
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M8.5 12C7.67 12 7 11.33 7 10.5S7.67 9 8.5 9 10 9.67 10 10.5 9.33 12 8.5 12M14 19C13.43 17.86 13 16.64 13 15.5C13 15.34 13 15.18 13.03 15.03L12 14L7 19H14M6 20V4H13V9H18V10.03C18.17 10 18.33 10 18.5 10C19 10 19.5 10.08 20 10.22V8L14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H15.91C15.5 21.44 15 20.76 14.55 20H6M22 15.5C22 18.1 18.5 22 18.5 22S15 18.1 15 15.5C15 13.6 16.6 12 18.5 12S22 13.6 22 15.5M19.7 15.6C19.7 15 19.1 14.4 18.5 14.4S17.3 14.9 17.3 15.6C17.3 16.2 17.8 16.8 18.5 16.8S19.8 16.2 19.7 15.6Z"
                  />
                </svg>
              </RowCenter>
            </Tooltip>
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
      <table>
        {createColGroupByColumns()}
        <tbody>{list}</tbody>
      </table>
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
          // window.PicMin.pickImages();
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
        onDrop={(event) => {
          event.preventDefault();
          state.dragActive = false;
          let files: ImageItem[] = [];
          for (let i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === "file") {
              const file = event.dataTransfer.items[i].getAsFile()!;
              files.push({ path: file.path });
            }
          }
          // window.PicMin.addImages(files);
          state.isReadList = true;
        }}
      ></div>
    </ColCenter>
  );
}

/**
 * 内容组件
 */
export const Content = observer(() => {
  return (
    <ColStart className={style.container}>
      {/* 标题栏 */}
      <table className={style.ttitle}>
        {createColGroupByColumns()}
        <thead>
          <tr>
            {columns.map((item) => {
              return <th key={item.key}>{item.title}</th>;
            })}
          </tr>
        </thead>
      </table>
      <div className={style.list}>
        {showContent()}
        <LoadingMask />
      </div>
    </ColStart>
  );
});
