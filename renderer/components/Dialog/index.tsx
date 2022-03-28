import React from "react";
import ReactDOM from "react-dom";
import { Dialog } from "./Dialog";

/**
 * 弹出一个通用对话框容器，显示在屏幕正中间
 * @param content 任意ReactNode
 * @param maskClosable 点击遮罩是否可关闭
 * @returns
 */
export async function showDialog(
  content?: React.ReactNode,
  maskClosable = false
) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  // 弹出对话框
  await new Promise<void>((resolve) => {
    ReactDOM.render(
      <Dialog status="show" maskClosable={maskClosable} content={content} />,
      div,
      resolve
    );
  });

  // 返回一个关闭对话框的功能
  return async () => {
    return new Promise<void>((resolve) => {
      ReactDOM.render(
        <Dialog
          status="hide"
          content={content}
          maskClosable={maskClosable}
          onClose={() => {
            if (div instanceof HTMLDivElement) {
              ReactDOM.unmountComponentAtNode(div);
              div.remove();
            }
            resolve();
          }}
        />,
        div
      );
    });
  };
}
