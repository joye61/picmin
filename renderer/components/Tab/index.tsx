import { RowCenter, RowStart } from "../Flex";
import style from "./index.module.scss";

type ListItem = {
  key: string;
  value: string;
};

interface TabProps {
  list: Array<ListItem>;
  value?: string;
  onChange?: (value: string) => void;
}

export function Tab(props: TabProps) {
  const { list, value = 0, onChange } = props;
  return (
    <RowStart className={style.container}>
      {list.map((item) => {
        return (
          <RowCenter
            className={value === item.key ? style.itemActive : undefined}
            key={item.key}
            onClick={() => {
              onChange?.(item.key);
            }}
          >
            {item.value}
          </RowCenter>
        );
      })}
    </RowStart>
  );
}
