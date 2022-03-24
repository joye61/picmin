import style from "./index.module.scss";

interface IndicatorProps {
  num?: number;
  size?: number;
  width?: number;
  height?: number;
  color?: string;
}

export function Indicator(props: IndicatorProps) {
  const { num = 8, size = 14, width = 2, height = 4, color = "#000" } = props;

  const content: React.ReactElement[] = [];
  for (let i = 0; i < num; i++) {
    content.push(
      <div key={i} style={{ transform: `rotate(${(360 * i) / num}deg)` }}>
        <div
          style={{
            opacity: (num - i) / num,
            marginLeft: -width / 2 + "px",
            width: width + "px",
            height: height + "px",
            backgroundColor: color,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={style.indicator}
      style={{
        width: size + "px",
        height: size + "px",
        animation: `${style.IndicatorRun} 0.8s steps(${num}, jump-end) infinite`,
      }}
    >
      {content}
    </div>
  );
}
