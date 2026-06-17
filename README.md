# guancioul.github.io

Personal site, built as a React + Vite single-page app and deployed to GitHub Pages.

## What it looks like

Warm beige background (`#efece6`), Inter for body text, JetBrains Mono for code/repo labels. A sticky header with nav links smooth-scrolls within the home page, and a "Blog" link routes to a separate page.

### Home (`/`)

A single scrolling page with a fixed scroll-spy dot nav:

- **Hero** — name, role, GitHub/Blog buttons, a contact card
- **About** — intro, social badges, tech stack tags, certification, Notable Contributions (from `src/data/highlights.ts`), and a live CNCF Stats score from `devstats.cncf.io`
- **Open Source** — a GitHub-style tabbed widget (Pull Requests / Issues) showing live data from the GitHub Search API, with status icons, association badges, relative time, and client-side pagination

### Blog (`/blog`, `/blog/:slug`)

Posts are Markdown files in `src/content/posts/*.md` with frontmatter (`title`, `date`, `summary`), rendered via `marked`. Routing uses `HashRouter` since the site is static GitHub Pages hosting with no server-side rewrites.

Both the GitHub and CNCF widgets cache their responses in `localStorage` (10 min and 6 hr TTL respectively) so repeat visits don't re-hit the APIs.

## Run it locally

```bash
npm install
npm run dev       # vite dev server
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
  data/        profile + highlights content (typed, no CMS)
  content/     blog posts (markdown + frontmatter)
  lib/         localStorage cache helper, markdown/frontmatter parsing, post loading
  components/  Header, Hero, Footer, ScrollDots, Highlights, DevStat, GithubContributions, ...
  pages/       Home, About, OpenSource, BlogList, BlogPost
  App.tsx      route table (/, /blog, /blog/:slug)
```

See `CLAUDE.md` / `AGENTS.md` for more detail on the architecture.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yaml`, which builds with
`npm run build` and publishes `dist/` to GitHub Pages. `.github/workflows/lint.yaml`
runs lint, markdownlint, and build as a check on every push/PR.
