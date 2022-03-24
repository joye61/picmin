import { useRef } from "react";
import { RowStart } from "../Flex";
import { Icon } from "../Icon";
import style from "./index.module.scss";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value?: string) => void;
}

export function Input(props: InputProps) {
  const { placeholder, value = "", onChange } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFocusRef = useRef<boolean>(false);

  return (
    <div className={style.container}>
      <input
        ref={inputRef}
        placeholder={placeholder}
        maxLength={6}
        value={value}
        onChange={(event) => {
          // 判断一个值是否是合法的数字字符串值
          const isValidNumberValue = (numStr: string) => {
            if (typeof numStr !== "string" || !numStr) {
              return false;
            }
            return /^[1-9]\d*$/.test(numStr);
          };
          const newValue = event.target.value;
          // 允许新值为空字符串
          if (newValue === "" || isValidNumberValue(newValue)) {
            onChange?.(newValue);
          }
        }}
        onFocus={() => (isFocusRef.current = true)}
        onBlur={() => {
          window.setTimeout(() => {
            if (isFocusRef.current) {
              isFocusRef.current = false;
            }
          }, 50);
        }}
      />
      <RowStart className={style.extra}>
        {value && (
          <Icon
            type="closeCircle"
            onClick={(event) => {
              event.stopPropagation();
              onChange?.("");
              window.setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          />
        )}
        <span>px</span>
      </RowStart>
    </div>
  );
}
