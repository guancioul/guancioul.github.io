# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository. (See `CLAUDE.md` for the Claude Code-specific copy of the same guidance.)

## Commands

```bash
npm install
npm run dev       # vite dev server
npm run build     # tsc -b && vite build, outputs to dist/
npm run preview   # serve the production build locally
npm run lint      # eslint .
```

There is no test suite. There is no `lint --fix` script; fix lint errors manually.

## Architecture

Personal portfolio site: React + TypeScript + Vite SPA, deployed to GitHub Pages (`guancioul.github.io`, root domain, static hosting only — no server-side rewrites). Routing therefore uses `HashRouter` (`react-router-dom`) so direct links / refreshes on `/blog` and `/blog/:slug` never hit the GitHub Pages 404 (path-based routing would break on static hosting).

`src/App.tsx` is the top-level shell: `Header` (always shown) + `<Routes>` for `/` (Home), `/blog` (BlogList), `/blog/:slug` (BlogPost) + `Footer` (always shown). The routed content is wrapped in a `<div key={location.pathname} className="page-transition">` that remounts and fades in on route change (`@keyframes page-fade-in` in `App.css`, opacity-only — do **not** add `transform` to this animation, since `ScrollDots` inside `Home` uses `position: fixed` and any non-`none` transform on an ancestor creates a new containing block, breaking its fixed-to-viewport positioning).

**Home page (`src/pages/Home.tsx`)** is a single scrolling page, not separate routes: `Hero` + `About` + `OpenSource` sections (`<section id="hero">`, `#about`, `#open-source`), plus a fixed-position `ScrollDots` nav. `useActiveSection(sectionIds)` (`src/hooks/useActiveSection.ts`) is an `IntersectionObserver`-based hook returning the currently-most-visible section id; it's called independently in both `App.tsx` (for `Header`'s nav-link highlighting) and `Home.tsx` (for `ScrollDots`) — calling it twice is intentional and cheap, not a bug to dedupe. Pass a **stable** array reference for `sectionIds` (defined as a module-level constant, not an inline literal) since the hook's effect re-subscribes whenever the array reference changes.

`Header` is route-aware: "About"/"Open Source" smooth-scroll via `scrollIntoView` when already on `/`, otherwise `navigate('/', { state: { scrollTo: id } })`; `Home` reads `location.state.scrollTo` in a one-shot effect (guarded by a ref) to scroll after navigating in from another route. "Blog" is a real `react-router` `Link`.

**Blog (`src/pages/BlogList.tsx`, `BlogPost.tsx`)**: posts are Markdown files in `src/content/posts/*.md` with `---`-delimited frontmatter (`title`, `date`, `summary`). `src/lib/posts.ts` loads them at build time via `import.meta.glob('../content/posts/*.md', { eager: true, query: '?raw', import: 'default' })`, parses frontmatter with the hand-rolled `parseFrontmatter` in `src/lib/markdown.ts` (intentionally not `gray-matter`, to avoid its `js-yaml`/Buffer weight for 3 flat string fields), derives the slug from the filename, and sorts by `date` descending. `BlogPost` renders the body via `marked` + `dangerouslySetInnerHTML` — safe here because post content is self-authored in-repo, not user input.

**Widgets fetching live external data** (`GithubContributions.tsx`, `DevStat.tsx`) call public APIs directly from the browser (GitHub Search API, `devstats.cncf.io`) and cache responses in `localStorage` via the shared `src/lib/cache.ts` helper (`cacheGet`/`cacheSet` with a TTL baked into each call site — 10 min for GitHub data, 6 hr for DevStat). When modifying these, initialize React state from `cacheGet(...)` via `useState(() => ...)` (lazy initializer) rather than setting it inside `useEffect`, to avoid a synchronous `setState`-in-effect lint error (`react-hooks/set-state-in-effect`).

**Styling**: plain per-component CSS files (no Tailwind, no CSS-in-JS, no UI library) importing shared tokens from `src/index.css` (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--font-sans`, `--font-mono`). `App.css` holds the home page's two-column `.page` grid (`grid-template-columns: 200px 1fr`, collapsing to one column under `768px`) used by `About`/`OpenSource`/`SectionHeading` — this grid is specific to numbered home sections; blog pages use their own simpler centered single-column layout, not `.page`. Be careful with broad selectors like `.page p` or `.app-main p` — a prior bug had such a rule leak into `Hero`'s dark card text because it had higher specificity than the card's own class; scope new global-ish rules narrowly.

## Deploy

`.github/workflows/deploy.yaml` builds (`npm run build`) and publishes `dist/` to GitHub Pages on every push to `main`. `.github/workflows/lint.yaml` runs `npm run lint` + `npm run build` as a check on every push/PR.
