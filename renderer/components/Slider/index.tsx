import { useEffect, useRef } from "react";
import style from "./index.module.scss";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function Slider(props: SliderProps) {
  const { value = 100, onChange } = props;

  const elRef = useRef<HTMLDivElement | null>(null);

  // onChange值置于ref中而不是effect是防止effect反复重建
  const changeRef = useRef<(value: number) => void>();
  changeRef.current = onChange;

  useEffect(() => {
    const el = elRef.current!;
    const doc = document.documentElement;
    let isMove = false;
    let newValue = 0;
    const updateValue = (event: MouseEvent) => {
      const { left, width } = el.getBoundingClientRect();
      const mouseLeft = event.clientX;
      let percent = ((mouseLeft - left) * 100) / width;
      if (percent < 0) {
        percent = 0;
      }
      if (percent > 100) {
        percent = 100;
      }
      newValue = percent;
      changeRef.current?.(newValue);
    };
    const mousedown = (event: MouseEvent) => {
      if (!isMove && (event.button === 0 || event.which === 1)) {
        isMove = true;
        updateValue(event);
      }
    };
    const mousemove = (event: MouseEvent) => {
      if (isMove) {
        updateValue(event);
      }
    };
    const mouseup = () => {
      if (isMove) {
        isMove = false;
        changeRef.current?.(newValue);
      }
    };
    el.addEventListener("mousedown", mousedown);
    doc.addEventListener("mousemove", mousemove);
    doc.addEventListener("mouseup", mouseup);

    return () => {
      el.removeEventListener("mousedown", mousedown);
      doc.removeEventListener("mousemove", mousemove);
      doc.removeEventListener("mouseup", mouseup);
    };
  }, []);

  return (
    <div className={style.container} ref={elRef}>
      <div style={{ width: `${value}%` }}></div>
    </div>
  );
}
