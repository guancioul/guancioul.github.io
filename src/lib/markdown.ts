import { marked } from 'marked';

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

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}
