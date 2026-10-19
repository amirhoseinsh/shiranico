import type { SVGProps } from "react";

export function Wordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 383 47" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="round">
        <path d="M34 6C27 1 4 1 4 13C4 29 35 15 35 32C35 45 10 46 2 39" />
        <path d="M62 3V43M94 3V43M62 23H94" />
        <path d="M125 3V43" />
        <path d="M156 43V3H176C193 3 193 25 176 25H157M174 25L194 43" />
        <path d="M220 43L240 3L260 43" />
        <path d="M286 43V3L322 43V3" />
        <path d="M355 3V43" />
      </g>
    </svg>
  );
}

export function ArchMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 106" fill="none" aria-hidden="true" {...props}>
      <g stroke="currentColor" strokeWidth="1.4">
        <path d="M8 100V51C8 31 23 18 45 6C67 18 82 31 82 51V100" />
        <path d="M23 100V60C23 45 31 34 45 25C59 34 67 45 67 60V100" />
        <path d="M37 100V69C37 59 40 52 45 46C50 52 53 59 53 69V100" />
        <path d="M45 0V106M1 100H89" opacity=".45" />
      </g>
    </svg>
  );
}

export function Arrow({ direction = "diagonal", ...props }: SVGProps<SVGSVGElement> & { direction?: "diagonal" | "down" | "up" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {direction === "diagonal" ? <path d="M5 19L19 5M5 5H19V19" /> : direction === "down" ? <path d="M12 3V21M5 14L12 21L19 14" /> : <path d="M12 21V3M5 10L12 3L19 10" />}
    </svg>
  );
}
