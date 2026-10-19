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

The hero takes motion inspiration from [8VC](https://www.8vc.com/). An original 4.6-second sequence starts with abstract circular drafting, pauses on the flat diagram, and resolves into a single beveled graphite arch during a quick dimensional turn. It settles completely, with no idle or pointer-driven movement. A discreet localized replay button appears after completion.

The geometric definition and timing live in `src/lib/arch-model.ts`; the smooth circular profile, extruded mesh, studio lighting, and deterministic renderer live in `src/lib/arch-scene.ts`. Three.js loads dynamically only when a motion-enabled visitor sees the hero. Shaders are prepared before the opening; elapsed time pauses offscreen or in hidden tabs, and the animation frame loop stops at the final pose. Reduced-motion visitors, unavailable WebGL, and disabled JavaScript use `public/brand/arch-still.png`, rendered from the same scene. All assets are self-hosted.

To regenerate that tracked fallback and the ignored motion review package, use Node.js 24 and run:

```sh
node scripts/render-arch.mjs
```

Open `design/motion/index.html` to review the isolated opening recording and four storyboard frames. The browser-generated recording includes a short hold after the 4.6-second sequence. This helper uses Node's TypeScript stripping API; the application itself retains the Node version requirement above.

## Portfolio

The portfolio appears in both languages and is editable in the content dictionaries. The official SVG logos are self-hosted and shown with consistent monochrome styling, spacing, and optical sizing. Their original shapes are preserved. Asset sources:

- Wish Work: [website](https://wishwork.org), [official logo](https://wishwork.org/logo.svg).
- Spash: [website](https://spash.space), [official logo](https://spash.space/_next/static/media/logo.002aowi4b1zfo.svg).
- IranChina: [website](https://www.iranchina.org), [official mark](https://www.iranchina.org/favicon.svg?v=brush-1).

Company descriptions summarize their public websites; portfolio membership was supplied by the site owner. Links open the respective websites in a separate tab. Future logo updates belong in `public/portfolio/`.

## Browser verification

The browser check starts and stops its own production server on port 3100. Build first, then run:

```sh
npm run check:browser
```

It checks both languages at 360, 768, and 1440 pixels, mobile navigation, keyboard access, language switching, portfolio logos and destination links, metadata, social assets, and the exclusion of the design archive. Motion checks cover completion, offscreen/hidden-tab suspension, pixel stability after settling and pointer movement, replay, reduced motion without WebGL initialization, blocked WebGL, and disabled JavaScript. When the local archive is present, it also verifies the proposal still prints to three A4 pages. Screenshots are written to ignored `test-results/`.

Checks use an existing Chromium installation. Set `CHROME_PATH` to a browser executable if discovery fails, or install one with `npx playwright-core install chromium`. Set `SITE_URL` to test an already running server instead.

To regenerate the tracked social images and Apple icon after an identity change:

```sh
node scripts/generate-brand-assets.mjs
```

The site uses static rendering and has no backend, analytics, CMS, or form service. Metadata targets `https://shirani.co`; hosting, DNS, and domain connection are configured separately.
