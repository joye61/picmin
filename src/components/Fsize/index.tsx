import style from "./index.module.scss";
import { Typography } from "antd";

export interface FsizeOption {
  value: [number, string];
}

export function Fsize({ value }: FsizeOption) {
  return (
    <span>
      <Typography.Text>{value[0]}</Typography.Text>&nbsp;
      <Typography.Text type="secondary">{value[1]}</Typography.Text>
    </span>
  );
}
