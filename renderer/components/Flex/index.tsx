import style from "./index.module.scss";
import clsx from "clsx";
import { type HTMLProps } from "react";

interface FlexProps extends HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Flex(props: FlexProps) {
  const { children, ...extra } = props;
  return <div {...extra}>{children}</div>;
}

export function RowStart(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.row, style.start, className)} {...extra} />
  );
}
export function RowEnd(props: FlexProps) {
  const { className, ...extra } = props;
  return <Flex className={clsx(style.row, style.end, className)} {...extra} />;
}
export function RowBetween(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.row, style.between, className)} {...extra} />
  );
}
export function RowAround(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.row, style.around, className)} {...extra} />
  );
}
export function RowCenter(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.row, style.center, className)} {...extra} />
  );
}
export function RowEvenly(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.row, style.evenly, className)} {...extra} />
  );
}

export function ColStart(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.col, style.start, className)} {...extra} />
  );
}
export function ColEnd(props: FlexProps) {
  const { className, ...extra } = props;
  return <Flex className={clsx(style.col, style.end, className)} {...extra} />;
}
export function ColBetween(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.col, style.between, className)} {...extra} />
  );
}
export function ColAround(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.col, style.around, className)} {...extra} />
  );
}
export function ColCenter(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.col, style.center, className)} {...extra} />
  );
}
export function ColEvenly(props: FlexProps) {
  const { className, ...extra } = props;
  return (
    <Flex className={clsx(style.col, style.evenly, className)} {...extra} />
  );
}
