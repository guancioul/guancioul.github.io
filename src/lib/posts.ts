import { parseFrontmatter } from './markdown';
import type { Locale } from '../i18n';

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
}

const DEFAULT_LOCALE: Locale = 'en';

const allModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function isTranslatedPath(path: string): boolean {
  return path.endsWith('.zh-TW.md');
}

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.zh-TW\.md$/, '').replace(/\.md$/, '');
}

const baseModules = Object.fromEntries(
  Object.entries(allModules).filter(([path]) => !isTranslatedPath(path)),
);

const translationModules = Object.fromEntries(
  Object.entries(allModules).filter(([path]) => isTranslatedPath(path)),
);

function buildPost(path: string, locale: Locale): Post {
  const slug = slugFromPath(path);
  const { data, content } = parseFrontmatter(baseModules[path]);

  let title = data.title ?? slug;
  let summary = data.summary ?? '';
  let body = content;

  if (locale !== DEFAULT_LOCALE) {
    const translatedPath = Object.keys(translationModules).find(
      (p) => slugFromPath(p) === slug,
    );
    if (translatedPath) {
      const { data: tData, content: tContent } = parseFrontmatter(translationModules[translatedPath]);
      title = tData.title ?? title;
      summary = tData.summary ?? summary;
      if (tContent) body = tContent;
    }
  }

  const tags = data.tags
    ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];

  return { slug, title, date: data.date ?? '', summary, tags, content: body };
}

const basePaths = Object.keys(baseModules);

export function getAllPosts(locale: Locale = DEFAULT_LOCALE): Post[] {
  return basePaths
    .map((path) => buildPost(path, locale))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Post | undefined {
  const path = basePaths.find((p) => slugFromPath(p) === slug);
  return path ? buildPost(path, locale) : undefined;
}
