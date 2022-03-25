import style from "./index.module.scss";
import clsx from "clsx";
import { useRef, useState } from "react";

type Option = {
  key: string;
  value: string;
};

interface SelectProps {
  options?: Option[];
  value?: string;
  onChange?: (key: string, option?: Option) => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Select(props: SelectProps) {
  const {
    disabled = false,
    options = [],
    value,
    onChange,
    children,
    className,
  } = props;
  const [showOption, setShowOption] = useState<boolean>(false);

  const status = useRef({
    onC1: false,
    onC2: false,
  });

  return (
    <div className={clsx(style.container, className)}>
      <div
        onMouseOver={() => {
          if (disabled) return;
          status.current.onC1 = true;
          setShowOption(true);
        }}
        onMouseLeave={() => {
          if (disabled) return;
          status.current.onC1 = false;
          window.setTimeout(() => {
            setShowOption(status.current.onC2);
          }, 150);
        }}
      >
        {children}
      </div>
      {showOption && (
        <div
          className={style.options}
          onMouseOver={() => {
            if (disabled) return;
            status.current.onC2 = true;
          }}
          onMouseLeave={() => {
            if (disabled) return;
            status.current.onC2 = false;
            window.setTimeout(() => {
              setShowOption(status.current.onC1);
            }, 150);
          }}
        >
          {options.map((item) => {
            let className: string | undefined = undefined;
            if (item.key === value) {
              className = style.current;
            }
            return (
              <div
                key={item.key}
                className={className}
                onClick={() => {
                  onChange?.(item.key, item);
                  status.current.onC2 = false;
                  setShowOption(false);
                }}
              >
                {item.value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
