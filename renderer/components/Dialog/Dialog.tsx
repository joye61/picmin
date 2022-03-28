import style from "./Dialog.module.scss";

export interface DialogOption {
  // show：显示，hide：隐藏
  status: "show" | "hide";
  // 淡出动画结束时触发
  onClose?: () => void;
  // 需要呈现的内容
  content?: React.ReactNode;
  // 点击遮罩是否可关闭
  maskClosable?: boolean;
}

export function Dialog(option: DialogOption) {
  let containerClass = style.container;
  let boxClass = style.box;
  if (option.status === "show") {
    containerClass += ` ${style.containerShow}`;
    boxClass += ` ${style.boxShow}`;
  } else {
    containerClass += ` ${style.containerHide}`;
    boxClass += ` ${style.boxHide}`;
  }

  return (
    <div className={containerClass}>
      <div
        className={boxClass}
        onAnimationEnd={(event) => {
          if (event.animationName === style.BoxHide) {
            option.onClose?.();
          }
        }}
      >
        {option.content}
      </div>
    </div>
  );
}
