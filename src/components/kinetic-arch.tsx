"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchScene } from "@/lib/arch-scene";
import { ARCH_DURATION, getArchPhase } from "@/lib/arch-model";
import styles from "./home.module.css";

type Mode = "preparing" | "scene" | "fallback";
const poster = "/brand/arch-still.png";

export function KineticArch({ replayLabel }: { replayLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const replayRef = useRef<(() => void) | null>(null);
  const [mode, setMode] = useState<Mode>("preparing");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    const canvas = canvasRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let scene: ArchScene | null = null;
    let disposed = false;
    let visible = false;
    let loading = false;
    let failed = false;
    let generation = 0;
    let frame = 0;
    let previous: number | null = null;
    let elapsed = 0;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      root.dataset.running = "false";
    }
    function render() {
      scene?.renderAt(elapsed);
      root.dataset.elapsed = String(Math.round(elapsed));
      root.dataset.phase = getArchPhase(elapsed);
    }
    function tick(now: number) {
      frame = 0;
      if (!scene || disposed || !visible || document.hidden || reduced.matches) { stop(); return; }
      if (previous !== null) elapsed = Math.min(ARCH_DURATION, elapsed + Math.min(now - previous, 64));
      previous = now;
      render();
      if (elapsed < ARCH_DURATION) {
        root.dataset.running = "true";
        frame = requestAnimationFrame(tick);
      } else {
        stop();
        setFinished(true);
      }
    }
    function schedule() {
      if (!frame && scene && visible && !document.hidden && !reduced.matches && elapsed < ARCH_DURATION) {
        root.dataset.running = "true";
        frame = requestAnimationFrame(tick);
      }
    }
    function useStill() {
      generation++;
      loading = false;
      stop();
      scene?.dispose();
      scene = null;
      elapsed = ARCH_DURATION;
      root.dataset.phase = "fallback";
      root.dataset.elapsed = String(ARCH_DURATION);
      setMode("fallback");
      setFinished(true);
    }
    async function ensureScene() {
      if (disposed || scene || loading || failed || reduced.matches || !visible) return;
      const request = ++generation;
      loading = true;
      let candidate: ArchScene | null = null;
      try {
        const { createArchScene } = await import("@/lib/arch-scene");
        if (disposed || request !== generation || reduced.matches) return;
        candidate = createArchScene(canvas, Math.min(devicePixelRatio || 1, innerWidth <= 700 ? 1.5 : 2));
        await candidate.ready;
        if (disposed || request !== generation || reduced.matches) { candidate.dispose(); return; }
        scene = candidate;
        candidate = null;
        loading = false;
        setMode("scene");
        setFinished(elapsed >= ARCH_DURATION);
        render();
        schedule();
      } catch {
        candidate?.dispose();
        if (!disposed && request === generation) { failed = true; useStill(); }
      }
    }
    function syncPlayback() {
      if (reduced.matches) { useStill(); return; }
      if (!visible || document.hidden) stop();
      else { void ensureScene(); schedule(); }
    }
    function onContextLost(event: Event) { event.preventDefault(); failed = true; useStill(); }

    replayRef.current = () => {
      if (!scene || reduced.matches || disposed) return;
      stop();
      elapsed = 0;
      setFinished(false);
      render();
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); }, { threshold: .08 });
    const resize = new ResizeObserver(() => scene?.resize(canvas.clientWidth, canvas.clientHeight));
    observer.observe(root);
    resize.observe(canvas);
    reduced.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    canvas.addEventListener("webglcontextlost", onContextLost);
    syncPlayback();
    return () => {
      disposed = true;
      generation++;
      stop();
      observer.disconnect();
      resize.disconnect();
      reduced.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      scene?.dispose();
      replayRef.current = null;
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.architecture} data-motion-art="" data-status={mode}>
      <div className={styles.motionStage} id="arch-sculpture" aria-hidden="true">
        <img className={styles.archPoster} src={poster} width="1024" height="1024" alt="" decoding="async" />
        <svg className={styles.archLoadingDrawing} viewBox="-3.6 -3.6 7.2 7.2" fill="none"><path d="M-2.7 .5A2.43 2.43 0 0 1 -1.2-2.25M2.4-.7A2.43 2.43 0 0 0 .8-2.3" stroke="#a7baaf" strokeWidth=".007" opacity=".45"/></svg>
        <canvas ref={canvasRef} className={styles.archCanvas} />
        <noscript><div className={styles.archNoScript}><img src={poster} width="1024" height="1024" alt="" /></div></noscript>
      </div>
      <div className={styles.motionFooter}>
        <button className={styles.motionToggle} type="button" aria-controls="arch-sculpture" hidden={!finished || mode !== "scene"} onClick={() => replayRef.current?.()}>
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" aria-hidden="true"><path d="M4 7A6.5 6.5 0 1 1 3.5 12M4 3V7H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
