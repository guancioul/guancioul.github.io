import { parseFrontmatter } from './markdown';

export interface ChallengeEntry {
  date: string;
  title: string;
  content: string;
  preview: string;
}

export interface Challenge {
  slug: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  targetDays: number | null;
  tags: string[];
  summary: string;
  entries: ChallengeEntry[];
}

const metaModules = import.meta.glob('../content/challenges/*/meta.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const entryModules = import.meta.glob('../content/challenges/*/entries/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromMetaPath(path: string): string {
  return path.split('/').slice(-2, -1)[0];
}

function slugFromEntryPath(path: string): string {
  return path.split('/').slice(-3, -2)[0];
}

const PREVIEW_LENGTH = 140;

function makePreview(content: string): string {
  const firstParagraph = content.split(/\r?\n\r?\n/)[0] ?? '';
  const plain = firstParagraph
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>#]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  return plain.length > PREVIEW_LENGTH ? `${plain.slice(0, PREVIEW_LENGTH).trim()}…` : plain;
}

const challenges: Challenge[] = Object.entries(metaModules)
  .map(([path, raw]) => {
    const slug = slugFromMetaPath(path);
    const { data } = parseFrontmatter(raw);

    const entries: ChallengeEntry[] = Object.entries(entryModules)
      .filter(([entryPath]) => slugFromEntryPath(entryPath) === slug)
      .map(([entryPath, entryRaw]) => {
        const { data: entryData, content } = parseFrontmatter(entryRaw);
        const filename = entryPath.split('/').pop()!.replace(/\.md$/, '');
        const date = entryData.date ?? filename;
        return { date, title: entryData.title ?? date, content, preview: makePreview(content) };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    return {
      slug,
      title: data.title ?? slug,
      image: data.image ?? '',
      startDate: data.startDate ?? '',
      endDate: data.endDate ?? '',
      targetDays: data.targetDays ? Number(data.targetDays) : null,
      tags: data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      summary: data.summary ?? '',
      entries,
    };
  })
  .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

export function getAllChallenges(): Challenge[] {
  return challenges;
}

export function getChallengeBySlug(slug: string): Challenge | undefined {
  return challenges.find((c) => c.slug === slug);
}
