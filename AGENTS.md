# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository. (`CLAUDE.md` is the Claude Code-specific copy and just points back here.)

## Commands

```bash
npm install
npm run dev       # astro dev server
npm run build     # astro check && astro build, outputs to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint .
npm run test      # vitest run
npm run test:watch # vitest (watch mode)
```

There is no test suite beyond Vitest unit tests in `tests/**/*.test.ts`. Run `npm run test` before pushing i18n routing changes.

## Architecture

Personal portfolio site: **Astro static site** with **React islands** (`@astrojs/react`), deployed to GitHub Pages (`guancioul.github.io`, root domain). Path-based routing (`/blog/hello-world`) — each route gets build-time static HTML with Open Graph meta tags. Legacy `#/` URLs redirect client-side via a script in `BaseLayout.astro`.

**Routing:** Astro file-based routes in `src/pages/*.astro` (English) and `src/pages/zh-TW/*.astro` (Traditional Chinese). Shared page logic lives in `src/route-templates/*.astro`. React page UI lives in `src/views/` and is mounted via island wrappers in `src/islands/AppIslands.tsx`, each wrapped in `PageFrame` (`LocaleProvider` + `Header` + `Footer`). Islands receive a `locale` prop from Astro (`'en' | 'zh-TW'`).

**i18n:** Route-based locales (`astro.config.mjs` → `i18n.routing.prefixDefaultLocale: false`). English at default paths (`/wiki/foo`); Chinese under `/zh-TW/` (`/zh-TW/wiki/foo`). Locale comes from the URL, not `localStorage`. Language switcher navigates to the paired URL via `switchLocalePath`. Internal links use `useLocalizedPath()` / `localizedPath()`. Missing `*.zh-TW.md` content silently falls back to English body at build time. View Transitions via `ClientRouter` in `BaseLayout.astro`.

**SEO / OG:** `src/layouts/BaseLayout.astro` sets `<html lang>`, `<title>`, `og:*`, and `twitter:*` per locale at build time. Metadata from `src/lib/content-meta.ts` (pass `locale`).

**Home page (`src/views/Home.tsx`)** is a single scrolling page: `Hero` + `About` + `Experience` + `Skills` + `OpenSource` + fixed `ScrollDots`. `useActiveSection` drives scroll-spy highlighting in both `HomeIsland` (for `ScrollDots`) and `Header`. Cross-route "About" scroll uses `/?scrollTo=about` (or `/zh-TW/?scrollTo=about`); cleared with `history.replaceState` to the locale home path.

`Header` uses locale-aware `<a href>` links. "About" smooth-scrolls on home, otherwise navigates to `{home}?scrollTo=about`.

**Blog (`src/views/BlogList.tsx`, `BlogPost.tsx`)**: posts in `src/content/posts/*.md` with frontmatter (`title`, `date`, `summary`). `src/lib/posts.ts` loads via `import.meta.glob` + hand-rolled `parseFrontmatter` in `src/lib/markdown.ts`. Sibling `*.zh-TW.md` files provide locale overrides (fallback to English when missing).

**Wiki (`src/views/WikiShell.tsx`, `WikiHome.tsx`, `WikiPage.tsx`)**: handbook pages in `src/content/wiki/<section>/*.md`. `src/lib/wiki.ts` builds section tree, locale fallbacks, prev/next nav. `WikiShell` provides desktop sidebar + mobile drawer.

**Widgets fetching live external data** (`GithubContributions.tsx`, `DevStat.tsx`, `LeetCodeStats.tsx`) call public APIs from the browser and cache in `localStorage` via `src/lib/cache.ts`. Initialize React state from `cacheGet(...)` via lazy `useState(() => ...)` initializer.

**Content collections (`src/content.config.ts`)**: Astro schemas for posts/travel (build-time validation). The posts glob auto-discovers base `*.md` files (excludes `*.zh-TW.md`). Runtime content loading still uses `src/lib/*.ts` loaders for locale support.

**Styling**: plain per-component CSS, shared tokens in `src/index.css`. `App.css` holds app shell + home `.page` grid. Do **not** add `transform` to animations on ancestors of fixed `ScrollDots` (breaks `position: fixed`).

## Deploy

`.github/workflows/deploy.yaml` builds (`npm run build`) and publishes `dist/` to GitHub Pages on every push to `main`. `.github/workflows/lint.yaml` runs `npm run lint` + `npm run build` as a check on every push/PR.
