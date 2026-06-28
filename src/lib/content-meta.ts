import { locales, type Locale } from '../i18n';
import { getAllPosts, getPostBySlug } from './posts';
import { getAllChallenges, getChallengeBySlug } from './challenges';
import { getAllTrips, getTripBySlug } from './travel';
import { localizedPath, notFoundPath } from './locale-path';
import { getWikiHandbookMeta, getWikiPageBySlug, getWikiSections } from './wiki';

export function getBlogStaticPaths() {
  return getAllPosts('en').map((post) => ({ params: { slug: post.slug } }));
}

export function getBlogListMeta(locale: Locale = 'en') {
  return {
    title: locales[locale].nav.blog,
    description: locale === 'zh-TW' ? 'Kuan-Hao Lai 的部落格文章。' : 'Blog posts by Kuan-Hao Lai.',
    url: localizedPath(locale, '/blog'),
  };
}

export function getBlogMeta(slug: string, locale: Locale = 'en') {
  const post = getPostBySlug(slug, locale);
  if (!post) return null;
  return {
    title: post.title,
    description: post.summary,
    url: localizedPath(locale, `/blog/${slug}`),
    ogType: 'article' as const,
  };
}

export function getChallengeStaticPaths() {
  return getAllChallenges('en').map((c) => ({ params: { slug: c.slug } }));
}

export function getChallengesListMeta(locale: Locale = 'en') {
  return {
    title: locales[locale].nav.challenges,
    description:
      locale === 'zh-TW' ? '個人挑戰與每日紀錄。' : 'Personal challenges and daily logs.',
    url: localizedPath(locale, '/challenges'),
  };
}

export function getChallengeMeta(slug: string, locale: Locale = 'en') {
  const challenge = getChallengeBySlug(slug, locale);
  if (!challenge) return null;
  return {
    title: challenge.title,
    description: challenge.summary,
    url: localizedPath(locale, `/challenges/${slug}`),
    ogImage: challenge.image || undefined,
  };
}

export function getChallengeEntryStaticPaths() {
  return getAllChallenges('en').flatMap((c) =>
    c.entries.map((e) => ({ params: { slug: c.slug, date: e.date } })),
  );
}

export function getChallengeEntryMeta(slug: string, date: string, locale: Locale = 'en') {
  const challenge = getChallengeBySlug(slug, locale);
  const entry = challenge?.entries.find((e) => e.date === date);
  if (!entry) return null;
  return {
    title: entry.title,
    description: entry.preview,
    url: localizedPath(locale, `/challenges/${slug}/${date}`),
    ogType: 'article' as const,
    ogImage: challenge?.image || undefined,
  };
}

export function getTravelStaticPaths() {
  return getAllTrips().map((t) => ({ params: { slug: t.slug } }));
}

export function getTravelListMeta(locale: Locale = 'en') {
  return {
    title: locales[locale].nav.travel,
    description: locale === 'zh-TW' ? '旅行紀錄與行程筆記。' : 'Travel logs and trip notes.',
    url: localizedPath(locale, '/travel'),
  };
}

export function getTravelMeta(slug: string, locale: Locale = 'en') {
  const trip = getTripBySlug(slug);
  if (!trip) return null;
  return {
    title: trip.title,
    description: trip.summary,
    url: localizedPath(locale, `/travel/${slug}`),
    ogImage: trip.cover || undefined,
  };
}

export function getWikiPageStaticPaths() {
  return getWikiSections('en').flatMap((s) =>
    s.pages.map((p) => ({ params: { slug: p.slug } })),
  );
}

export function getWikiPageMeta(slug: string, locale: Locale = 'en') {
  const page = getWikiPageBySlug(slug, locale);
  if (!page) return null;
  return { title: page.title, description: page.summary, url: localizedPath(locale, `/wiki/${slug}`) };
}

export function getWikiHomeMeta(locale: Locale = 'en') {
  const meta = getWikiHandbookMeta(locale);
  return { title: meta.title || 'Wiki', description: meta.intro, url: localizedPath(locale, '/wiki') };
}

export function getNotableContributionsMeta(locale: Locale = 'en') {
  return {
    title: locale === 'zh-TW' ? '重要貢獻' : 'Notable Contributions',
    description:
      locale === 'zh-TW'
        ? '在 CNCF 等開源專案的精選 pull request。'
        : 'Selected open source pull requests across CNCF projects.',
    url: localizedPath(locale, '/notable-contributions'),
  };
}

export function getNotFoundMeta(locale: Locale = 'en') {
  return { title: '404', url: notFoundPath(locale) };
}

export { notFoundPath };
