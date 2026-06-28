# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository. (`CLAUDE.md` is the Claude Code-specific copy and just points back here.)

## Commands

```bash
npm install
npm run dev       # astro dev server
npm run build     # astro check && astro build, outputs to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint .
```

There is no test suite. There is no `lint --fix` script; fix lint errors manually.

## Architecture

Personal portfolio site: **Astro static site** with **React islands** (`@astrojs/react`), deployed to GitHub Pages (`guancioul.github.io`, root domain). Path-based routing (`/blog/hello-world`) — each route gets build-time static HTML with Open Graph meta tags. Legacy `#/` URLs redirect client-side via a script in `BaseLayout.astro`.

**Routing:** Astro file-based routes in `src/pages/*.astro`. React page UI lives in `src/views/` and is mounted via island wrappers in `src/islands/AppIslands.tsx`, each wrapped in `PageFrame` (`LocaleProvider` + `Header` + `Footer`).

**SEO / OG:** `src/layouts/BaseLayout.astro` sets `<title>`, `og:*`, and `twitter:*` from Astro frontmatter props. Per-route metadata comes from `src/lib/content-meta.ts` (English base content at build time). Runtime locale switching does not affect OG tags (crawlers do not run JS).

**Home page (`src/views/Home.tsx`)** is a single scrolling page: `Hero` + `About` + `Experience` + `Skills` + `OpenSource` + fixed `ScrollDots`. `useActiveSection` drives scroll-spy highlighting in both `HomeIsland` (for `ScrollDots`) and `Header`. Cross-route "About" scroll uses `/?scrollTo=about` query param (read once on mount, then cleared with `history.replaceState`).

`Header` uses plain `<a href>` links (no React Router). "About" smooth-scrolls on `/`, otherwise navigates to `/?scrollTo=about`.

**Blog (`src/views/BlogList.tsx`, `BlogPost.tsx`)**: posts in `src/content/posts/*.md` with frontmatter (`title`, `date`, `summary`). `src/lib/posts.ts` loads via `import.meta.glob` + hand-rolled `parseFrontmatter` in `src/lib/markdown.ts`. Sibling `*.zh-TW.md` files provide runtime locale overrides. `BlogPost` renders via `marked` + `dangerouslySetInnerHTML` + `useMarkdownEmbeds`.

**Wiki (`src/views/WikiShell.tsx`, `WikiHome.tsx`, `WikiPage.tsx`)**: handbook pages in `src/content/wiki/<section>/*.md`. `src/lib/wiki.ts` builds section tree, locale fallbacks, prev/next nav. `WikiShell` provides desktop sidebar + mobile drawer.

**Widgets fetching live external data** (`GithubContributions.tsx`, `DevStat.tsx`, `LeetCodeStats.tsx`) call public APIs from the browser and cache in `localStorage` via `src/lib/cache.ts`. Initialize React state from `cacheGet(...)` via lazy `useState(() => ...)` initializer.

**Content collections (`src/content.config.ts`)**: Astro schemas for posts/travel (build-time validation). The posts glob auto-discovers base `*.md` files (excludes `*.zh-TW.md`). Runtime content loading still uses `src/lib/*.ts` loaders for locale support.

**Styling**: plain per-component CSS, shared tokens in `src/index.css`. `App.css` holds app shell + home `.page` grid. Do **not** add `transform` to animations on ancestors of fixed `ScrollDots` (breaks `position: fixed`).

## Deploy

`.github/workflows/deploy.yaml` builds (`npm run build`) and publishes `dist/` to GitHub Pages on every push to `main`. `.github/workflows/lint.yaml` runs `npm run lint` + `npm run build` as a check on every push/PR.
