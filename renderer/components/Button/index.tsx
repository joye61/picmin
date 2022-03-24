import { type ReactNode } from "react";
import style from "./index.module.scss";
import { RowCenter } from "../Flex";
import { Icon } from "../Icon";
import clsx from "clsx";

interface ButtonProps  {
  icon?: string;
  type?: "primary" | "link" | "outline";
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: (evnet: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export function Button(props: ButtonProps) {
  const { icon, type = "primary", disabled = false, children, onClick, className } = props;
  const finalClassName = clsx(
    style.btn,
    style[type],
    !children && style.noContent,
    disabled && style.disabled,
    className
  );
  return (
    <RowCenter
      className={finalClassName}
      onClick={(event) => {
        if (disabled) return;
        onClick?.(event);
      }}
    >
      {icon && <Icon type={icon} />}
      {children}
    </RowCenter>
  );
}
