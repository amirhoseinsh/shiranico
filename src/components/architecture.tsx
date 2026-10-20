import { KineticArch } from "./kinetic-arch";
import styles from "./home.module.css";

export function Architecture({ replayLabel }: { replayLabel: string }) {
  return <KineticArch replayLabel={replayLabel} />;
}

export function SectorGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" aria-hidden="true" className={styles.sectorGlyph} data-draw-art="">
      <g stroke="currentColor" strokeWidth=".9">
        {index === 0 ? <><path d="M15 60L50 42L85 60L50 78L15 60ZM15 42L50 24L85 42L50 60L15 42ZM15 24L50 6L85 24L50 42L15 24Z"/><path d="M15 24V60M85 24V60M50 42V78" opacity=".45"/></> : null}
        {index === 1 ? <><circle cx="50" cy="40" r="25"/><circle cx="50" cy="40" r="15"/><path d="M50 0V11M50 69V80M10 40H21M79 40H90M21 11L29 19M71 61L79 69M21 69L29 61M71 19L79 11"/><path d="M50 15L42 42H56L48 65"/></> : null}
        {index === 2 ? <><path d="M15 64V24L35 14V54L15 64ZM40 64V34L60 24V54L40 64ZM65 64V14L85 4V54L65 64Z"/><path d="M8 73H92M15 24L35 34M40 34L60 44M65 14L85 24" opacity=".45"/></> : null}
        {index === 3 ? <><path d="M50 7L80 24V57L50 74L20 57V24L50 7ZM50 7V74M20 24L80 57M80 24L20 57M20 24H80M20 57H80"/><circle cx="50" cy="40" r="12"/><circle cx="50" cy="7" r="3"/><circle cx="20" cy="57" r="3"/><circle cx="80" cy="57" r="3"/></> : null}
        {index === 4 ? <><path d="M12 66V27L39 12L66 27V66M39 12V66M39 27L66 12L88 24V66M66 12V66M5 66H95"/><path d="M23 33V55M50 33V55M77 31V55" opacity=".45"/></> : null}
      </g>
    </svg>
  );
}
