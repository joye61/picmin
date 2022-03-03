import style from "./index.module.scss";
import { Typography } from "antd";
import { HTMLProps } from "react";
import { type BaseType } from "antd/lib/typography/Base";
import clsx from "clsx";

export interface FsizeOption extends HTMLProps<HTMLSpanElement> {
  formats: [number, string];
  withGap?: boolean;
  type?: BaseType;
}

export function Fsize(props: FsizeOption) {
  const { formats, type, withGap = false, className, ...extra } = props;
  return (
    <span {...extra} className={clsx(style.Fsize, withGap && style.withGap, className)}>
      <Typography.Text type={type}>{formats[0]}</Typography.Text>
      <Typography.Text type="secondary">{formats[1]}</Typography.Text>
    </span>
  );
}
