import { marked } from 'marked';

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

export function renderWikiMarkdown(markdown: string): { html: string; headings: MarkdownHeading[] } {
  const headings = extractHeadings(markdown);
  let headingIndex = 0;

  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
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
  return marked.parse(markdown) as string;
}
