import { DrawLine } from "./draw-line";
import styles from "./home.module.css";

/** A full-height structural divider, positioned in a content grid's gutter. */
export function ColumnRule({ className }: { className: string }) {
  return <span aria-hidden="true" data-column-rule="" className={`${styles.columnRule} ${className}`}><DrawLine edge="start" /></span>;
}
