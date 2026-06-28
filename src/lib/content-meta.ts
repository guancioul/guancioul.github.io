import { getAllPosts, getPostBySlug } from './posts';
import { getAllChallenges, getChallengeBySlug } from './challenges';
import { getAllTrips, getTripBySlug } from './travel';
import { getWikiHandbookMeta, getWikiPageBySlug, getWikiSections } from './wiki';

export function getBlogStaticPaths() {
  return getAllPosts('en').map((post) => ({ params: { slug: post.slug } }));
}

export function getBlogMeta(slug: string) {
  const post = getPostBySlug(slug, 'en');
  if (!post) return null;
  return { title: post.title, description: post.summary, url: `/blog/${slug}`, ogType: 'article' as const };
}

export function getChallengeStaticPaths() {
  return getAllChallenges('en').map((c) => ({ params: { slug: c.slug } }));
}

export function getChallengeMeta(slug: string) {
  const challenge = getChallengeBySlug(slug, 'en');
  if (!challenge) return null;
  return {
    title: challenge.title,
    description: challenge.summary,
    url: `/challenges/${slug}`,
    ogImage: challenge.image || undefined,
  };
}

export function getChallengeEntryStaticPaths() {
  return getAllChallenges('en').flatMap((c) =>
    c.entries.map((e) => ({ params: { slug: c.slug, date: e.date } })),
  );
}

export function getChallengeEntryMeta(slug: string, date: string) {
  const challenge = getChallengeBySlug(slug, 'en');
  const entry = challenge?.entries.find((e) => e.date === date);
  if (!entry) return null;
  return {
    title: entry.title,
    description: entry.preview,
    url: `/challenges/${slug}/${date}`,
    ogType: 'article' as const,
    ogImage: challenge?.image || undefined,
  };
}

export function getTravelStaticPaths() {
  return getAllTrips().map((t) => ({ params: { slug: t.slug } }));
}

export function getTravelMeta(slug: string) {
  const trip = getTripBySlug(slug);
  if (!trip) return null;
  return {
    title: trip.title,
    description: trip.summary,
    url: `/travel/${slug}`,
    ogImage: trip.cover || undefined,
  };
}

export function getWikiPageStaticPaths() {
  return getWikiSections('en').flatMap((s) =>
    s.pages.map((p) => ({ params: { slug: p.slug } })),
  );
}

export function getWikiPageMeta(slug: string) {
  const page = getWikiPageBySlug(slug, 'en');
  if (!page) return null;
  return { title: page.title, description: page.summary, url: `/wiki/${slug}` };
}

export function getWikiHomeMeta() {
  const meta = getWikiHandbookMeta('en');
  return { title: meta.title || 'Wiki', description: meta.intro, url: '/wiki' };
}
