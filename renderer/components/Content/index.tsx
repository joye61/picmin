import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { ColStart, RowStart, RowBetween, RowCenter, RowEnd } from "../Flex";
import { Icon } from "../Icon";
import { Indicator } from "../Indicator";
import { Loading } from "../Loading";
import { state } from "@/state";
import { DragZone } from "../DragZone";
import { type ReactNode } from "react";
import clsx from "clsx";
import { fsize, handleFilesDrop } from "@/utils";
import { Rate } from "../Rate";

const { ipcRenderer } = require("electron");
const fs = require("fs-extra");

interface ColType {
  key: string;
  title: string;
  className?: string;
  render?: (item: ImageItem, index: number) => ReactNode;
}

const columns: ColType[] = [
  {
    key: "status",
    title: "状态",
    className: style._status,
    render(row) {
      return (
        <RowCenter className={style.status}>
          {row.status === 1 ? <Icon type="check" /> : <Indicator />}
        </RowCenter>
      );
    },
  },
  {
    key: "name",
    title: "源图片",
    className: style._name,
    render(row) {
      return (
        <div className={style.name}>
          <RowBetween>
            <RowCenter
              onClick={() => ipcRenderer.send("LocateImage", row.path)}
            >
              {row.preview ? (
                <img src={URL.createObjectURL(row.preview)} />
              ) : (
                <div className={style.previewLoading} />
              )}
            </RowCenter>
            <span title={row.path}>{row.name}</span>
          </RowBetween>
        </div>
      );
    },
  },
  {
    key: "oldSize",
    title: "原大小",
    className: style._oldSize,
    render(row) {
      return typeof row.oldSize === "number" ? fsize(row.oldSize) : "-";
    },
  },
  {
    key: "newSize",
    title: "新大小",
    className: style._newSize,
    render(row) {
      return typeof row.newSize === "number" ? fsize(row.newSize) : "-";
    },
  },
  {
    key: "rate",
    title: "压缩率",
    className: style._rate,
    render(row) {
      if (typeof row.oldSize === "number" && typeof row.newSize === "number") {
        return <Rate oldSize={row.oldSize} newSize={row.newSize} />;
      }
      return "-";
    },
  },
  {
    key: "action",
    title: "操作",
    className: style._action,
    render(row, index) {
      return (
        <RowEnd className={style.action}>
          <div
            className={style.actionRemove}
            onClick={() => {
              // 删除缓存文件
              fs.removeSync(row.tempPath);
              state.list.splice(index, 1);
            }}
          >
            <Icon type="remove" />
          </div>
        </RowEnd>
      );
    },
  },
];

export const Content = observer(() => {
  let content: React.ReactNode = null;
  if (!state.list || state.list.length === 0) {
    content = <DragZone />;
  } else {
    content = (
      <>
        <RowStart className={style.THeader}>
          {columns.map((col) => {
            return (
              <div key={col.key} className={col.className}>
                {col.title}
              </div>
            );
          })}
        </RowStart>
        <div
          className={clsx(style.list, state.isSaving && style.noScroll)}
          onDragOver={(event) => {
            if (state.isReadList) return;
            event.preventDefault();
          }}
          onDrop={(event) => {
            if (state.isReadList) return;
            event.preventDefault();
            handleFilesDrop(event);
          }}
        >
          {state.list.map((row, index) => {
            const cols = columns.map((col) => {
              return (
                <div key={col.key} className={col.className}>
                  {col.render?.(row, index)}
                </div>
              );
            });
            return (
              <RowStart
                key={row.path}
                className={clsx(
                  style.TRow,
                  row.status === 0 && style.rowDisable
                )}
              >
                {cols}
              </RowStart>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <ColStart className={style.container}>
      {content}
      <Loading />
    </ColStart>
  );
});
