import styles from "./scroll-lines.module.css";

/** A decorative rule with a stable box; only its ink animates. */
export function DrawLine({ edge = "top" }: { edge?: "top" | "bottom" | "start" | "end" }) {
  return <span aria-hidden="true" data-draw-line="" data-axis={edge === "start" || edge === "end" ? "y" : "x"} className={`${styles.rule} ${styles[edge]}`}><span className={styles.ink} /></span>;
}
