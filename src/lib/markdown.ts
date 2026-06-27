import { marked, Renderer, type Tokens } from 'marked';

export interface MarkdownHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const data: Record<string, string> = {};

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data, content: raw.trim() };
  }

  const [, frontmatter, body] = match;

  for (const line of frontmatter.split(/\r?\n/)) {
    const lineMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, value] = lineMatch;
    data[key.trim()] = value.trim();
  }

  return { data, content: body.trim() };
}

export function slugifyHeading(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

export function extractHeadings(markdown: string): MarkdownHeading[] {
  const idCounts = new Map<string, number>();
  const headings: MarkdownHeading[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    if (level !== 2 && level !== 3) continue;

    const rawText = match[2].trim();
    const base = slugifyHeading(rawText);
    const seen = idCounts.get(base) ?? 0;
    idCounts.set(base, seen + 1);
    const id = seen === 0 ? base : `${base}-${seen}`;

    headings.push({
      id,
      text: rawText.replace(/\*\*/g, ''),
      level,
    });
  }

  return headings;
}

const SITE_HOSTS = new Set(['guancioul.github.io', 'localhost', '127.0.0.1']);

export function isExternalHref(href: string): boolean {
  if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  try {
    const { protocol, hostname } = new URL(href);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    return !SITE_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

function configureExternalLinks(renderer: Renderer): void {
  renderer.link = function ({ href, title, tokens }: Tokens.Link) {
    const text = this.parser.parseInline(tokens);
    const titleAttr = title ? ` title="${title}"` : '';
    if (isExternalHref(href)) {
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  };
}

function createMarkdownRenderer(): Renderer {
  const renderer = new Renderer();
  configureExternalLinks(renderer);
  return renderer;
}

export function renderWikiMarkdown(markdown: string): { html: string; headings: MarkdownHeading[] } {
  const headings = extractHeadings(markdown);
  let headingIndex = 0;

  const renderer = createMarkdownRenderer();
  renderer.heading = function ({ tokens, depth }: Tokens.Heading) {
    const text = this.parser.parseInline(tokens);
    if (depth === 2 || depth === 3) {
      const id = headings[headingIndex]?.id ?? slugifyHeading(text);
      headingIndex += 1;
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  const html = marked.parse(markdown, { renderer }) as string;
  return { html, headings };
}

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { renderer: createMarkdownRenderer() }) as string;
}
