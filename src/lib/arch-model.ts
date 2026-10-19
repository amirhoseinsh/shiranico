/** One geometric definition, shared by the drawing, contours and preview tools. */
export const ARCH = {
  halfWidth: 1.65,
  peak: 2.3,
  bottom: -2.5,
  thickness: .29,
  depth: .62,
  viewSize: 7.2,
} as const;

export const ARCH_DURATION = 4600;
export const ARC_SAMPLES = 240;
export const circleCenter = (ARCH.peak ** 2 - ARCH.halfWidth ** 2) / (2 * ARCH.halfWidth);
export const outerRadius = ARCH.halfWidth + circleCenter;
export const innerRadius = outerRadius - ARCH.thickness;
export const innerPeak = Math.sqrt(innerRadius ** 2 - circleCenter ** 2);
export const leftPeakAngle = Math.atan2(ARCH.peak, -circleCenter);
export const rightPeakAngle = Math.atan2(ARCH.peak, circleCenter);
export const innerPeakAngle = Math.atan2(innerPeak, circleCenter);

export function clamp(value: number, min = 0, max = 1) { return Math.min(max, Math.max(min, value)); }
export function progress(time: number, start: number, end: number) { return clamp((time - start) / (end - start)); }
export function smooth(value: number) { const t = clamp(value); return t * t * (3 - 2 * t); }
export function easeOut(value: number) { return 1 - (1 - clamp(value)) ** 4; }
export function mix(from: number, to: number, value: number) { return from + (to - from) * value; }

export function getArchPhase(time: number) {
  if (time >= ARCH_DURATION) return "settled";
  if (time >= 3250) return "settling";
  if (time >= 2650) return "reveal";
  if (time >= 2200) return "hold";
  if (time >= 900) return "diagram";
  return "drawing";
}
