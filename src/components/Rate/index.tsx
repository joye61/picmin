import style from "./index.module.scss";
import { RowStart } from "../Flex";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Typography } from "antd";

interface RateOption {
  oldSize: number;
  newSize: number;
}

export function Rate(item: RateOption) {
  let percent: number | string = 0;
  if (item.oldSize !== 0) {
    percent = ((item.newSize - item.oldSize) * 100) / item.oldSize;
    percent = Number(Math.abs(percent).toFixed(2));
  }

  // let percent = ((item.newSize - item.oldSize) * 100) / item.oldSize;
  // percent = Number(Math.abs(percent).toFixed(2));
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
