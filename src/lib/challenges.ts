import { parseFrontmatter } from './markdown';
import type { Locale } from '../i18n';

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
  rule: string;
  entries: ChallengeEntry[];
}

const DEFAULT_LOCALE: Locale = 'en';

const metaModules = import.meta.glob('../content/challenges/*/meta.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// Translated variants live alongside the base file, e.g. meta.zh-TW.md next to meta.md.
const metaTranslationModules = import.meta.glob('../content/challenges/*/meta.zh-TW.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const allEntryModules = import.meta.glob('../content/challenges/*/entries/*.md', {
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

function isTranslatedEntryPath(path: string): boolean {
  return path.endsWith('.zh-TW.md');
}

function dateFromEntryPath(path: string): string {
  const filename = path.split('/').pop()!;
  return filename.replace(/\.zh-TW\.md$/, '').replace(/\.md$/, '');
}

// `entries/*.md` also matches `entries/<date>.zh-TW.md`, so split those back out
// rather than treating each translation as its own entry.
const baseEntryModules = Object.fromEntries(
  Object.entries(allEntryModules).filter(([path]) => !isTranslatedEntryPath(path)),
);
const translatedEntryModules = Object.fromEntries(
  Object.entries(allEntryModules).filter(([path]) => isTranslatedEntryPath(path)),
);

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

function findTranslationPath(modules: Record<string, string>, slug: string, date?: string): string | undefined {
  return Object.keys(modules).find(
    (path) => slugFromEntryPath(path) === slug && (date === undefined || dateFromEntryPath(path) === date),
  );
}

function buildChallenge(metaPath: string, locale: Locale): Challenge {
  const slug = slugFromMetaPath(metaPath);
  const { data } = parseFrontmatter(metaModules[metaPath]);

  const translationPath =
    locale !== DEFAULT_LOCALE
      ? Object.keys(metaTranslationModules).find((path) => slugFromMetaPath(path) === slug)
      : undefined;
  const translation = translationPath ? parseFrontmatter(metaTranslationModules[translationPath]) : null;

  const tags = translation?.data.tags ?? data.tags;

  const entries: ChallengeEntry[] = Object.entries(baseEntryModules)
    .filter(([path]) => slugFromEntryPath(path) === slug)
    .map(([path, raw]) => {
      const date = dateFromEntryPath(path);
      const { data: entryData, content: entryContent } = parseFrontmatter(raw);

      let title = entryData.title ?? date;
      let body = entryContent;

      if (locale !== DEFAULT_LOCALE) {
        const translatedPath = findTranslationPath(translatedEntryModules, slug, date);
        if (translatedPath) {
          const { data: tData, content: tContent } = parseFrontmatter(translatedEntryModules[translatedPath]);
          title = tData.title ?? title;
          if (tContent) body = tContent;
        }
      }

      return { date, title, content: body, preview: makePreview(body) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return {
    slug,
    title: translation?.data.title ?? data.title ?? slug,
    image: data.image ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
    targetDays: data.targetDays ? Number(data.targetDays) : null,
    tags: tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    summary: translation?.data.summary ?? data.summary ?? '',
    rule: translation?.data.rule ?? data.rule ?? '',
    entries,
  };
}

const metaPaths = Object.keys(metaModules);

export function getAllChallenges(locale: Locale = DEFAULT_LOCALE): Challenge[] {
  return metaPaths
    .map((path) => buildChallenge(path, locale))
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getChallengeBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Challenge | undefined {
  const metaPath = metaPaths.find((path) => slugFromMetaPath(path) === slug);
  return metaPath ? buildChallenge(metaPath, locale) : undefined;
}
