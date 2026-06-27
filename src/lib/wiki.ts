import { parseFrontmatter } from './markdown';
import type { Locale } from '../i18n';

export interface WikiHandbookMeta {
  title: string;
  intro: string;
}

export interface WikiPage {
  slug: string;
  sectionId: string;
  sectionTitle: string;
  title: string;
  summary: string;
  updatedAt: string;
  order: number;
  hidden: boolean;
  relatedPosts: string[];
  relatedChallenges: string[];
  content: string;
}

export interface WikiSection {
  id: string;
  title: string;
  order: number;
  pages: WikiPage[];
}

export interface WikiAdjacentPages {
  prev: WikiPage | null;
  next: WikiPage | null;
}

const DEFAULT_LOCALE: Locale = 'en';

const META_BASENAME = '_meta.md';
const SECTION_BASENAME = '_section.md';

const allModules = import.meta.glob('../content/wiki/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function isTranslatedPath(path: string): boolean {
  return path.endsWith('.zh-TW.md');
}

function basename(path: string): string {
  return path.split('/').pop()!;
}

function isHandbookMetaPath(path: string): boolean {
  const name = basename(path);
  return name === META_BASENAME || name === '_meta.zh-TW.md';
}

function isSectionMetaPath(path: string): boolean {
  const name = basename(path);
  return name === SECTION_BASENAME || name === '_section.zh-TW.md';
}

function isTemplatePath(path: string): boolean {
  const name = basename(path);
  return name === 'template.md' || name === 'template.zh-TW.md';
}

function isPagePath(path: string): boolean {
  if (isHandbookMetaPath(path) || isSectionMetaPath(path) || isTemplatePath(path)) return false;
  if (isTranslatedPath(path)) return false;
  const parts = path.split('/');
  // Must live inside a section folder: .../wiki/<section>/<page>.md
  const wikiIndex = parts.indexOf('wiki');
  return wikiIndex !== -1 && parts.length > wikiIndex + 2;
}

function sectionIdFromPagePath(path: string): string {
  const parts = path.split('/');
  const wikiIndex = parts.indexOf('wiki');
  return parts[wikiIndex + 1];
}

function sectionIdFromSectionMetaPath(path: string): string {
  const parts = path.split('/');
  const wikiIndex = parts.indexOf('wiki');
  return parts[wikiIndex + 1];
}

function slugFromPagePath(path: string): string {
  return basename(path).replace(/\.zh-TW\.md$/, '').replace(/\.md$/, '');
}

function parseList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function findTranslationPath(
  modules: Record<string, string>,
  matcher: (path: string) => boolean,
): string | undefined {
  return Object.keys(modules).find(matcher);
}

function loadSectionMeta(sectionId: string, locale: Locale): { title: string; order: number } {
  const basePath = Object.keys(allModules).find(
    (p) => !isTranslatedPath(p) && isSectionMetaPath(p) && sectionIdFromSectionMetaPath(p) === sectionId,
  );
  const defaults = { title: sectionId, order: 0 };
  if (!basePath) return defaults;

  const { data } = parseFrontmatter(allModules[basePath]);
  let title = data.title ?? sectionId;
  const order = Number.parseInt(data.order ?? '0', 10) || 0;

  if (locale !== DEFAULT_LOCALE) {
    const translatedPath = findTranslationPath(
      allModules,
      (p) => isTranslatedPath(p) && isSectionMetaPath(p) && sectionIdFromSectionMetaPath(p) === sectionId,
    );
    if (translatedPath) {
      const { data: tData } = parseFrontmatter(allModules[translatedPath]);
      title = tData.title ?? title;
    }
  }

  return { title, order };
}

function buildWikiPage(path: string, locale: Locale): WikiPage {
  const slug = slugFromPagePath(path);
  const sectionId = sectionIdFromPagePath(path);
  const { data, content } = parseFrontmatter(allModules[path]);
  const sectionMeta = loadSectionMeta(sectionId, locale);

  let title = data.title ?? slug;
  let summary = data.summary ?? '';
  let body = content;

  if (locale !== DEFAULT_LOCALE) {
    const translatedPath = Object.keys(allModules).find(
      (p) => isTranslatedPath(p) && slugFromPagePath(p) === slug && sectionIdFromPagePath(p) === sectionId,
    );
    if (translatedPath) {
      const { data: tData, content: tContent } = parseFrontmatter(allModules[translatedPath]);
      title = tData.title ?? title;
      summary = tData.summary ?? summary;
      if (tContent) body = tContent;
    }
  }

  return {
    slug,
    sectionId,
    sectionTitle: sectionMeta.title,
    title,
    summary,
    updatedAt: data.updatedAt ?? '',
    order: Number.parseInt(data.order ?? '0', 10) || 0,
    hidden: data.hidden === 'true',
    relatedPosts: parseList(data.relatedPosts),
    relatedChallenges: parseList(data.relatedChallenges),
    content: body,
  };
}

const basePagePaths = Object.keys(allModules).filter(isPagePath);

if (import.meta.env.DEV) {
  const slugs = basePagePaths.map(slugFromPagePath);
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      console.warn(`[wiki] duplicate slug: ${slug}`);
    }
    seen.add(slug);
  }
}

function sortSections(sections: WikiSection[]): WikiSection[] {
  return [...sections].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

function sortPages(pages: WikiPage[], locale: Locale): WikiPage[] {
  return [...pages].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title, locale),
  );
}

function buildSections(locale: Locale, includeHidden: boolean): WikiSection[] {
  const sectionIds = [...new Set(basePagePaths.map(sectionIdFromPagePath))];
  const sections: WikiSection[] = sectionIds.map((id) => {
    const meta = loadSectionMeta(id, locale);
    const pages = basePagePaths
      .filter((p) => sectionIdFromPagePath(p) === id)
      .map((p) => buildWikiPage(p, locale))
      .filter((p) => includeHidden || !p.hidden);
    return { id, title: meta.title, order: meta.order, pages: sortPages(pages, locale) };
  });
  return sortSections(sections).filter((s) => s.pages.length > 0);
}

function flatPages(locale: Locale, includeHidden: boolean): WikiPage[] {
  return buildSections(locale, includeHidden).flatMap((s) => s.pages);
}

export function getWikiHandbookMeta(locale: Locale = DEFAULT_LOCALE): WikiHandbookMeta {
  const basePath = Object.keys(allModules).find((p) => !isTranslatedPath(p) && basename(p) === META_BASENAME);
  const defaults = { title: 'Wiki', intro: '' };
  if (!basePath) return defaults;

  const { data, content } = parseFrontmatter(allModules[basePath]);
  let title = data.title ?? defaults.title;
  let intro = data.summary ?? content;

  if (locale !== DEFAULT_LOCALE) {
    const translatedPath = Object.keys(allModules).find(
      (p) => isTranslatedPath(p) && basename(p) === '_meta.zh-TW.md',
    );
    if (translatedPath) {
      const { data: tData, content: tContent } = parseFrontmatter(allModules[translatedPath]);
      title = tData.title ?? title;
      intro = tData.summary ?? tContent ?? intro;
    }
  }

  return { title, intro };
}

export function getWikiSections(locale: Locale = DEFAULT_LOCALE): WikiSection[] {
  return buildSections(locale, false);
}

export function getWikiPageBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): WikiPage | undefined {
  const path = basePagePaths.find((p) => slugFromPagePath(p) === slug);
  return path ? buildWikiPage(path, locale) : undefined;
}

export function getAdjacentWikiPages(slug: string, locale: Locale = DEFAULT_LOCALE): WikiAdjacentPages {
  const pages = flatPages(locale, false);
  const index = pages.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  };
}
