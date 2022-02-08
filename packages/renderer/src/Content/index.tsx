import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColCenter, ColStart } from "../Flex";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { RowType, state } from "../state";
import { Typography } from "antd";
import clsx from "clsx";
import { getSupportExtensionsAsString } from "../image";
import React from "react";
import { type ImageItem } from "@common/const";

interface ColType {
  key: keyof RowType;
  title: string;
  className?: string;
  render?(row?: RowType): React.ReactNode;
}

const columns: ColType[] = [
  {
    key: "status",
    title: "状态",
    className: style._status,
    render(item) {
      let icon = <CheckCircleOutlined className={style.statusDone} />;
      if (item!.status === 0) {
        icon = <LoadingOutlined className={style.statusActive} />;
      }
      return icon;
    },
  },
  { key: "name", title: "名称", className: style._name },
  { key: "oldSize", title: "原大小", className: style._oldSize },
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
          window.PicMin.pickImages();
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
              files.push({ path: file.path, status: 1 });
            }
          }
          window.PicMin.addImages(files);
        }}
      ></div>
    </ColCenter>
  );
}

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
      <div className={style.list}>{showContent()}</div>
    </ColStart>
  );
});
