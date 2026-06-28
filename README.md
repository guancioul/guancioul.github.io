# guancioul.github.io

Personal site, built as an Astro static site with React islands and deployed to GitHub Pages.

## What it looks like

Warm beige background (`#efece6`), Inter for body text, JetBrains Mono for code/repo labels. A sticky header with nav links smooth-scrolls within the home page, and "Blog"/"Wiki"/"Challenges"/"Travel" links route to separate pages. A dark mode toggle in the header swaps the theme via `data-theme="dark"` on `<html>`, persisted to `localStorage` and defaulting to `prefers-color-scheme`.

### Home (`/`)

A single scrolling page with a fixed scroll-spy dot nav:

- **Hero** — name, role, GitHub/Blog buttons, a contact card
- **About** — intro, social badges, tech stack tags, certification, Notable Contributions (from `src/data/highlights.ts`), and a live CNCF Stats score from `devstats.cncf.io`
- **Open Source** — a GitHub-style tabbed widget (Pull Requests / Issues) showing live data from the GitHub Search API, with status icons, association badges, relative time, and client-side pagination

Both the GitHub and CNCF widgets cache their responses in `localStorage` (10 min and 6 hr TTL respectively) so repeat visits don't re-hit the APIs.

### Blog (`/blog`, `/blog/:slug`)

Posts are Markdown files in `src/content/posts/*.md` with frontmatter (`title`, `date`, `summary`), rendered via `marked`. Astro generates static HTML per route with Open Graph meta tags for social sharing. Legacy `#/` URLs redirect to path-based URLs automatically.

### Wiki (`/wiki`, `/wiki/:slug`)

Evergreen handbook pages in `src/content/wiki/<section>/*.md`, grouped by section (`_section.md` per folder). Site-wide intro in `_meta.md`. Frontmatter: `title`, `summary`, `updatedAt`, `order`, optional `relatedPosts` / `relatedChallenges` (comma-separated slugs), optional `hidden: true` (omit from nav; direct URL still works). Translations use sibling `*.zh-TW.md` files (same pattern as blog/challenges).

`WikiShell` provides a desktop sticky sidebar and a mobile drawer (Contents button in a sub-bar under the site header). Pages use prev/next navigation across the visible page order. Copy `template.md` when adding a new page.

Images go in `public/assets/wiki/<slug>/` and are referenced as `/assets/wiki/...` in markdown or `md-gallery` / `md-carousel` / `md-full-bleed` embeds.

### Challenges (`/challenges`, `/challenges/:slug`, `/challenges/:slug/:date`)

Personal habit/discipline challenges (e.g. "Project 50", "Dopamine Detox"). Each challenge lives at `src/content/challenges/<slug>/meta.md` (frontmatter: `title`, `image`, `startDate`, `endDate`, `targetDays`, `tags`, `summary`) with daily entries in `src/content/challenges/<slug>/entries/*.md` (frontmatter: `date`, `title`; body is that day's notes, often a `## Checklist` of markdown checkboxes). The list page shows a progress bar (`entries.length / targetDays`); each entry links to its own page. A sibling `template.md` per challenge (outside the glob patterns `lib/challenges.ts` reads, so it's never picked up as real content) is a copy-paste starting point for new days.

### Blog vs Wiki vs Challenges

Three layers, different jobs:

| Layer | Role | References | Typical content |
| --- | --- | --- | --- |
| **Challenges** | Daily log while a run is in progress | — | Checklists, what happened today |
| **Wiki** | Evergreen handbook | **External** — books, videos, articles; organize frameworks and variants like a sourced reference doc | What something is, common approaches, general how-to |
| **Blog** | Dated personal writing | **Your own wiki** (no need to re-cite external sources) | Reflection, especially retro / Next steps after a run ends |

- **Wiki** is written for a reader who doesn't know which personal run you're on. Claims should link to sources (markdown links are enough — no formal citation format). Use `updatedAt`, not `date`.
- **Blog** is first-person and time-stamped (`date`). Background belongs on wiki; the post links there instead of repeating it.
- **Challenges** are the rawest layer — one entry per day during the run.

Typical flow: **Challenge (during) → Blog (after: reflection) → Wiki (reference, updated when the general write-up changes).** A wiki page can exist before, during, or after a challenge; blog retros usually come after. Not every topic needs a wiki page; not every wiki page needs a matching blog post.

### Travel (`/travel`, `/travel/:slug`)

Trip write-ups. Each trip is `src/content/travel/<slug>/meta.md` (frontmatter: `title`, `cover`, `location`, `startDate`, `endDate`, `tags`, `summary`, optional `hidden: true` to unlist it from `/travel` while keeping the direct URL reachable). The body is freeform markdown — embed photos inline wherever they belong in the prose using the shared markdown content embeds described below.

### Markdown content embeds

Available in any markdown body rendered via `dangerouslySetInnerHTML` (blog posts, wiki pages, challenge entries, travel write-ups) — the CSS lives in `src/index.css`, the interactive behavior is wired up by `src/hooks/useMarkdownEmbeds.ts`, called from each page's `BlogPost.tsx` / `WikiPage.tsx` / `ChallengeEntry.tsx` / `TravelDetail.tsx` in `src/views/`:

- **`<div class="md-gallery"><img src="..."> ...</div>`** — a masonry grid (CSS multi-column, default 3 columns; override with `data-columns="2"`). Clicking a photo grows it in place to a centered preview (FLIP animation from the clicked thumbnail's on-screen position) while the rest of the gallery dims; closes on an outside click or `Escape`.
- **`<div class="md-carousel"><img src="..."> ...</div>`** — a slideshow that auto-advances only while scrolled into view (pauses out of view), with prev/next buttons and swipe/drag support for manual navigation.
- **`<div class="md-full-bleed"><img src="..."></div>`** — a full viewport-width image (pure CSS breakout, no JS), uncropped (`height: auto`).

`.md-gallery` and `.md-carousel` also break out wider than the narrow text column (`width: min(950px, 92vw)`, centered) rather than sitting at the same width as body text, collapsing back to the column width on mobile.

## Run it locally

```bash
npm install
npm run dev       # astro dev server
```

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
npm run lint        # eslint
npm run lint:md     # markdownlint
```

## Structure

```text
src/
  pages/       Astro routes (*.astro) — file-based routing
  layouts/     BaseLayout.astro (HTML shell, OG meta, theme script)
  islands/     React island wrappers (PageFrame + views)
  views/       React page components (BlogList, Home, WikiPage, …)
  data/        profile + highlights content (typed, no CMS)
  content/     blog posts, wiki handbooks, challenges, and travel write-ups (markdown + frontmatter)
  hooks/       useTheme, useLocale, useMarkdownEmbeds, useActiveSection, …
  lib/         cache, markdown/frontmatter parsing, posts/wiki/challenges/travel loading, content-meta
  components/  Header, Hero, Footer, ScrollDots, DevStat, GithubContributions, PageFrame, …
```

See `CLAUDE.md` / `AGENTS.md` for more detail on the architecture.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yaml`, which builds with
`npm run build` and publishes `dist/` to GitHub Pages. `.github/workflows/lint.yaml`
runs lint, markdownlint, and build as a check on every push/PR.
