import styles from "./home.module.css";

// Original vector architecture: a pointed arch, its depth, and a shared horizon.
export function Architecture() {
  return (
    <div className={styles.architecture} aria-hidden="true">
      <svg viewBox="0 0 860 900" fill="none" className={styles.architectureSvg}>
        <defs>
          <linearGradient id="arch-front" x1="160" y1="130" x2="670" y2="760" gradientUnits="userSpaceOnUse"><stop stopColor="#46504a"/><stop offset=".4" stopColor="#2a3530"/><stop offset="1" stopColor="#101e19"/></linearGradient>
          <linearGradient id="arch-side" x1="240" y1="330" x2="620" y2="420" gradientUnits="userSpaceOnUse"><stop stopColor="#17221c"/><stop offset=".65" stopColor="#69756a"/><stop offset="1" stopColor="#37463c"/></linearGradient>
          <linearGradient id="arch-inner" x1="297" y1="210" x2="510" y2="750" gradientUnits="userSpaceOnUse"><stop stopColor="#738779"/><stop offset=".4" stopColor="#314b3c"/><stop offset="1" stopColor="#15291f"/></linearGradient>
          <linearGradient id="arch-sill" x1="250" y1="750" x2="680" y2="880" gradientUnits="userSpaceOnUse"><stop stopColor="#5e6e60"/><stop offset="1" stopColor="#111d16"/></linearGradient>
          <linearGradient id="arch-light" x1="270" y1="440" x2="570" y2="440" gradientUnits="userSpaceOnUse"><stop stopColor="#006a58" stopOpacity=".05"/><stop offset="1" stopColor="#00a693" stopOpacity=".33"/></linearGradient>
          <radialGradient id="arch-glow"><stop stopColor="#00a693" stopOpacity=".16"/><stop offset="1" stopColor="#00a693" stopOpacity="0"/></radialGradient>
          <linearGradient id="arch-fade"><stop stopColor="#f5f4f0" stopOpacity="0"/><stop offset=".5" stopColor="#f5f4f0" stopOpacity=".22"/><stop offset="1" stopColor="#f5f4f0" stopOpacity="0"/></linearGradient>
          <filter id="arch-grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
          <clipPath id="arch-front-clip"><path fillRule="evenodd" d="M128 773V380C128 217 246 125 397 43C548 125 666 217 666 380V773H128ZM238 773H556V395C556 294 487 227 397 171C307 227 238 294 238 395V773Z"/></clipPath>
        </defs>
        <ellipse cx="440" cy="490" rx="390" ry="410" fill="url(#arch-glow)"/>
        <g stroke="#b2c2b7" strokeOpacity=".065" strokeWidth="1"><path d="M0 180H860M0 380H860M0 580H860M0 780H860M130 0V900M397 0V900M666 0V900"/></g>
        <path d="M15 820L456 661L850 854M15 820H850M102 900L456 661L708 900" stroke="#b3c7b7" strokeOpacity=".14"/>
        <path d="M187 804V412C187 249 305 157 456 75C607 157 725 249 725 412V804L666 773V380C666 217 548 125 397 43L187 804Z" fill="url(#arch-side)"/>
        <path d="M128 773L187 804H725L666 773H128Z" fill="url(#arch-sill)"/>
        <path d="M238 773V395C238 294 307 227 397 171L456 204C366 260 297 327 297 428V804L238 773Z" fill="url(#arch-inner)"/>
        <path d="M397 171C487 227 556 294 556 395V773L615 804V428C615 327 546 260 456 204L397 171Z" fill="url(#arch-side)"/>
        <path d="M297 804V428C297 327 366 260 456 204C546 260 615 327 615 428V804H297Z" fill="#10251c"/>
        <path d="M297 804V428C297 327 366 260 456 204C546 260 615 327 615 428V804H297Z" fill="url(#arch-light)"/>
        <path d="M128 773V380C128 217 246 125 397 43C548 125 666 217 666 380V773H128ZM238 773H556V395C556 294 487 227 397 171C307 227 238 294 238 395V773Z" fill="url(#arch-front)" fillRule="evenodd"/>
        <g clipPath="url(#arch-front-clip)" opacity=".65" filter="url(#arch-grain)"><rect x="128" y="43" width="538" height="730" fill="url(#arch-front)"/></g>
        <path d="M128 773V380C128 217 246 125 397 43C548 125 666 217 666 380V773" stroke="#b9c6ba" strokeOpacity=".22"/>
        <path d="M238 773V395C238 294 307 227 397 171C487 227 556 294 556 395V773" stroke="#b9c6ba" strokeOpacity=".38"/>
        <path d="M156 773V384C156 236 268 147 397 76C526 147 638 236 638 384V773" stroke="#b9c6ba" strokeOpacity=".09"/>
        <path d="M297 804V428C297 327 366 260 456 204" stroke="#8dba9f" strokeOpacity=".45"/>
        <path d="M397 43L456 75M666 380L725 412M666 773L725 804" stroke="#a9b6a9" strokeOpacity=".24"/>
        <path d="M397 7V845" stroke="url(#arch-fade)"/>
        <path d="M91 470H754" stroke="url(#arch-fade)"/>
        <circle cx="397" cy="470" r="4" stroke="#00a693" strokeOpacity=".65"/>
        <path d="M456 428V803M297 606H615" stroke="#00a693" strokeOpacity=".18"/>
        <path d="M325 802V489C325 419 381 360 456 316C531 360 587 419 587 489V802" stroke="#00a693" strokeOpacity=".32"/>
        <path d="M350 802V539C350 484 396 436 456 397C516 436 562 484 562 539V802" stroke="#00a693" strokeOpacity=".17"/>
        <path d="M238 773L96 875H496L615 804" fill="url(#arch-sill)" opacity=".3"/>
        <g stroke="#d2ddd2" strokeOpacity=".4"><path d="M100 43H112M106 37V49M742 804H754M748 798V810"/></g>
        <g fill="#a9b6ab" fontFamily="Arial, sans-serif" fontSize="9" letterSpacing="2"><text x="93" y="26">S / 01</text><text x="678" y="842">PERSPECTIVE</text></g>
      </svg>
      <div className={styles.artCaption}><span dir="ltr">ROOTED IN HERITAGE</span><span dir="ltr">DESIGNED FOR TOMORROW</span></div>
    </div>
  );
}

export function SectorGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 80" fill="none" aria-hidden="true" className={styles.sectorGlyph}>
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
