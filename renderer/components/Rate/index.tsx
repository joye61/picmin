import { RowStart } from "../Flex";
import { Icon } from "../Icon";
import style from "./index.module.scss";

interface RateProps {
  newSize: number;
  oldSize: number;
}

export function Rate(props: RateProps) {
  const { oldSize, newSize } = props;

  const showPercent = () => {
    let percent: number = 0;
    if (oldSize !== 0) {
      percent = ((newSize - oldSize) * 100) / oldSize;
      percent = Number(Math.abs(percent).toFixed(2));
    }
    return percent;
  };

  if (newSize <= oldSize) {
    return (
      <RowStart className={style.rateDown}>
        <Icon type="down" />
        <span>{showPercent()}%</span>
      </RowStart>
    );
  } else {
    return (
      <RowStart className={style.rateUp}>
        <Icon type="up" />
        <span>{showPercent()}%</span>
      </RowStart>
    );
  }
}
