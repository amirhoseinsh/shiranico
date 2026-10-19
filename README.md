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
- Shared page composition, navigation, and architectural SVG artwork are in `src/components/`. Styles use CSS Modules; global design tokens are in `src/app/globals.css`.
- Runtime fonts are in `src/assets/fonts/`. No Google Fonts or remote font requests are used.
- SVG identity files, localized social previews, and the Apple icon are in `public/brand/`; the favicon is `public/icon.svg`. The inline mark and wordmark live in `src/components/brand.tsx`; keep their paths aligned with the downloadable SVG assets when changing the identity.
- `design/` is an ignored local archive containing the original proposal, original font collection, and reference moodboards. It is outside `public/` and is never needed to build or serve the website. The archived proposal HTML is self-contained and still prints to three A4 pages.

Brand colors: charcoal `#151C19`, warm off-white `#F5F4F0`, primary teal `#00A693`, with deeper teal `#007F70` for accessible text on light surfaces. The arch artwork is original vector geometry, not extracted from the moodboards.

## Browser verification

The browser check starts and stops its own production server on port 3100. Build first, then run:

```sh
npm run check:browser
```

It checks both languages at 360, 768, and 1440 pixels, mobile navigation, keyboard access, language switching, metadata, social assets, reduced motion, and the exclusion of the design archive. When the local archive is present, it also verifies the proposal still prints to three A4 pages. Screenshots are written to ignored `test-results/`.

Checks use an existing Chromium installation. Set `CHROME_PATH` to a browser executable if discovery fails, or install one with `npx playwright-core install chromium`. Set `SITE_URL` to test an already running server instead.

To regenerate the tracked social images and Apple icon after an identity change:

```sh
node scripts/generate-brand-assets.mjs
```

The site uses static rendering and has no backend, analytics, CMS, or form service. Metadata targets `https://shirani.co`; hosting, DNS, and domain connection are configured separately.
