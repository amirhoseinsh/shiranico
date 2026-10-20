# SHIRANI

Persian-first investment group website for **shirani.co**. Built with Next.js App Router, TypeScript, CSS Modules, and self-hosted Peyda. Persian is served at `/`; English at `/en`, with separate document languages and directions.

## Development

Requires Node.js 20.9 or newer (Node.js 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To run a production build:

```sh
npm run build
npm run typecheck
npm start
```

## Content and identity

- Edit both typed language dictionaries in `src/lib/content.ts`. The public email and production domain are defined there.
- Shared page composition and navigation are in `src/components/`. Styles use CSS Modules; global design tokens are in `src/app/globals.css`.
- Runtime fonts are in `src/assets/fonts/`. No Google Fonts or remote font requests are used.
- SVG identity files, localized social previews, and the Apple icon are in `public/brand/`; the favicon is `public/icon.svg`. The inline mark and wordmark live in `src/components/brand.tsx`; keep their paths aligned with the downloadable SVG assets when changing the identity.
- `design/` is an ignored local archive containing the original proposal, original font collection, and reference moodboards. It is outside `public/` and is never needed to build or serve the website. The archived proposal HTML is self-contained and still prints to three A4 pages.

Brand colors: charcoal `#151C19`, warm off-white `#F5F4F0`, primary teal `#00A693`, with deeper teal `#007F70` for accessible text on light surfaces. The arch artwork is original vector geometry, not extracted from the moodboards.

The hero takes motion inspiration from [8VC](https://www.8vc.com/). An original 4.6-second sequence starts with abstract circular drafting, pauses on the flat diagram, and resolves into an open architectural arch during a quick dimensional turn. Grayscale front contours, `#00A693` inner/rear contours, and six depth connections describe the volume without filled surfaces. A faint, localized `#1C39BB` halo adds a small blue accent behind one rear curve. It settles completely, with no idle or pointer-driven movement. A discreet localized replay button appears after completion.

The geometric definition and timing live in `src/lib/arch-model.ts`; explicit smooth contours and the deterministic renderer live in `src/lib/arch-scene.ts`. Three.js `Line2`/`LineMaterial` maintain consistent CSS-pixel stroke widths. The drawing curves remain visible as the final front contours; unused construction lines fade after the turn. Three.js loads dynamically only when a motion-enabled visitor sees the hero. Shaders are prepared before the opening; elapsed time pauses offscreen or in hidden tabs, and the animation frame loop stops at the final pose. Reduced-motion visitors, unavailable WebGL, and disabled JavaScript use `public/brand/arch-still.png`, rendered from the same scene. All assets are self-hosted.

The header divider draws from the brand side (right in Persian, left in English), after a 120ms delay over 880ms, with a brief teal leading highlight. CSS starts it independently of WebGL and hydration; navigation remains usable immediately. Arch replay does not repeat the divider. CSS scripting and reduced-motion media queries give no-JavaScript and reduced-motion visitors the completed, static line.

On phones the artwork follows the headline, before the description and contact links, so it fits within the first screen at common phone sizes. Playback waits until 60% of the canvas is visible, with an adjusted threshold for short viewports; a sliver touching the screen does not start it. Language arrows and decorative separators use SVG paths to avoid emoji substitution on Safari.

Scroll motion follows the divider behavior observed on [8VC](https://www.8vc.com/): horizontal rules draw over 1.5 seconds and vertical rules over 2 seconds, once on viewport entry, then remain complete. Section separators, portfolio frames and underlines, sector rows, section-number separators, contact and footer rules all participate. Sector glyphs and the about arch/orbits draw their actual SVG strokes with a restrained stagger. The shared `DrawLine` component preserves a stable layout box; one `IntersectionObserver` in `ScrollLines` starts CSS transform and stroke animations, without a scroll listener or animation library. Persian rules draw right-to-left and English rules left-to-right. Reduced motion or disabled JavaScript shows complete lines immediately; changing motion preferences never erases completed lines. Header and hero retain their existing opening sequences.

Tall structural dividers split the hero's text/art columns, separate the approach and portfolio columns, run through the sector table, and divide the about and contact layouts. `ColumnRule` positions these full-height strokes in the grid gutters. On phones the dividers adapt to a leading vertical rail along the stacked sections, keeping the artwork visible in the first screen and leaving the copy unobstructed. The about divider joins full-width top and bottom rules.

To regenerate that tracked fallback and the ignored motion review package, use Node.js 24 and run:

```sh
node scripts/render-arch.mjs
```

Open `design/motion/index.html` to review the isolated opening recording and storyboard frames, including the start and end of the dimensional turn. The browser-generated recording includes a short hold after the 4.6-second sequence. The renderer also checks transparent surfaces and stroke continuity at fixed times. This helper uses Node's TypeScript stripping API; the application itself retains the Node version requirement above.

## Portfolio

The portfolio appears in both languages and is editable in the content dictionaries. The official SVG logos are self-hosted and shown with consistent monochrome styling, spacing, and optical sizing. Their original shapes are preserved. Asset sources:

- Wish Work: [website](https://wishwork.org), [official logo](https://wishwork.org/logo.svg).
- Spash: [website](https://spash.space), [official logo](https://spash.space/_next/static/media/logo.002aowi4b1zfo.svg).
- IranChina: [website](https://www.iranchina.org), [official mark](https://www.iranchina.org/favicon.svg?v=brush-1).

Company descriptions summarize their public websites; portfolio membership was supplied by the site owner. Homepage cards open dedicated profiles at `/portfolio/wishwork`, `/portfolio/spash` and `/portfolio/iranchina`, with matching `/en/portfolio/…` pages. Profiles share a server-rendered layout, local logos, business introductions and product/service summaries. Website links inside profiles open the official sites in a separate tab. Header and footer language switches keep the selected company; section navigation returns to the matching language's homepage. Each profile has its own canonical URL, language alternates and sitemap entry. Unknown companies return 404.

Edit introductions in `src/lib/portfolio.ts`. Public facts were checked against the official company sites and the [Wish Work software](https://wishwork.org/solution/software/), [AI](https://wishwork.org/solution/ai/) and [ERP](https://wishwork.org/solution/erp/) pages, [Spash provider guide](https://spash.space/provider-guide), and [IranChina services](https://www.iranchina.org/services). Investment reasons are separate, in `backingStories`. They express the owner's stated mission: backing lasting, useful value beyond hype, with a distinct explanation for each business. The copy makes no claims about returns or deal terms. Every company requires a rationale in both languages. Future logo updates belong in `public/portfolio/`.

## Browser verification

The browser check starts and stops its own production server on port 3100. Build first, then run:

```sh
npm run check:browser
```

It checks both languages at 360, 768, and 1440 pixels, mobile navigation, keyboard access, language switching, portfolio logos and destination links, metadata, social assets, and the exclusion of the design archive. Motion checks cover header direction/timing independently of delayed WebGL, completion, offscreen/hidden-tab suspension, pixel stability after settling and pointer movement, replay without repeating the header, reduced motion without WebGL initialization, blocked WebGL, and disabled JavaScript. When the local archive is present, it also verifies the proposal still prints to three A4 pages. Screenshots are written to ignored `test-results/`.

Checks use an existing Chromium installation. Set `CHROME_PATH` to a browser executable if discovery fails, or install one with `npx playwright-core install chromium`. Set `SITE_URL` to test an already running server instead.

To regenerate the tracked social images and Apple icon after an identity change:

```sh
node scripts/generate-brand-assets.mjs
```

The site uses static rendering and has no backend, analytics, CMS, or form service. Metadata targets `https://shirani.co`; hosting, DNS, and domain connection are configured separately.
