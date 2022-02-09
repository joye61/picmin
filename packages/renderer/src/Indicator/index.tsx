import style from "./index.module.scss";
import clsx from "clsx";
import React from "react";

export interface IndicatorProps {
  large?: boolean;
  white?: boolean;
}

export function Indicator(props: IndicatorProps) {
  const bars = [];
  for (let i = 0; i < 8; i++) {
    bars.push(<div key={i} />);
  }
  return (
    <div
      className={clsx(
        style.container,
        props.large && style.large,
        props.white && style.white
      )}
    >
      {bars}
    </div>
  );
}
