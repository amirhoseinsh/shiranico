"use client";

import { useEffect } from "react";
import styles from "./scroll-lines.module.css";

/** One observer for all server-rendered decorative lines; no scroll handler. */
export function ScrollLines() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(document.querySelectorAll<HTMLElement | SVGElement>("[data-draw-line], [data-draw-art]"));
    const strokes: SVGGeometryElement[] = [];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement | SVGElement).dataset.lineState = "drawn";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -24px 0px", threshold: 0 });

    function showCompleted() {
      observer.disconnect();
      for (const target of targets) {
        target.dataset.lineState = "complete";
      }
    }

    if (reduced.matches) showCompleted();
    else {
      for (const target of targets) {
        if (target.hasAttribute("data-draw-art")) {
          target.classList.add(styles.art);
          target.querySelectorAll<SVGGeometryElement>("path, circle, line, polyline, rect").forEach((stroke, index) => {
            stroke.setAttribute("pathLength", "1");
            stroke.style.setProperty("--stroke-delay", `${index * 45}ms`);
            strokes.push(stroke);
          });
        }
        target.dataset.lineState = "pending";
        observer.observe(target);
      }
    }
    function onMotionChange() {
      // A completed line never erases or replays when preferences change.
      if (reduced.matches) showCompleted();
    }
    reduced.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onMotionChange);
      targets.forEach(target => { delete target.dataset.lineState; target.classList.remove(styles.art); });
      strokes.forEach(stroke => {
        stroke.removeAttribute("pathLength");
        stroke.style.removeProperty("--stroke-delay");
      });
    };
  }, []);
  return null;
}
