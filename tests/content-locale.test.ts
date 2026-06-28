import { describe, expect, it } from 'vitest';
import { getAllChallenges, getChallengeBySlug } from '../src/lib/challenges';
import { getAllPosts, getPostBySlug } from '../src/lib/posts';
import { getWikiPageBySlug, getWikiSections } from '../src/lib/wiki';
import { getTripBySlug } from '../src/lib/travel';

describe('content locale routing parity', () => {
  it('exposes the same wiki slugs regardless of locale', () => {
    const enSlugs = getWikiSections('en')
      .flatMap((s) => s.pages.map((p) => p.slug))
      .sort();
    const zhSlugs = getWikiSections('zh-TW')
      .flatMap((s) => s.pages.map((p) => p.slug))
      .sort();
    expect(zhSlugs).toEqual(enSlugs);
  });

  it('exposes the same challenge slugs and entry dates for EN and zh-TW', () => {
    const en = getAllChallenges('en');
    const zh = getAllChallenges('zh-TW');
    expect(zh.map((c) => c.slug).sort()).toEqual(en.map((c) => c.slug).sort());

    for (const slug of en.map((c) => c.slug)) {
      const enDates = getChallengeBySlug(slug, 'en')!.entries.map((e) => e.date).sort();
      const zhDates = getChallengeBySlug(slug, 'zh-TW')!.entries.map((e) => e.date).sort();
      expect(zhDates).toEqual(enDates);
    }
  });

  it('exposes the same blog slugs for EN and zh-TW', () => {
    const enSlugs = getAllPosts('en').map((p) => p.slug).sort();
    const zhSlugs = getAllPosts('zh-TW').map((p) => p.slug).sort();
    expect(zhSlugs).toEqual(enSlugs);
  });
});

describe('content locale selection', () => {
  it('returns zh-TW wiki content when translation exists', () => {
    const en = getWikiPageBySlug('dopamine-detox', 'en');
    const zh = getWikiPageBySlug('dopamine-detox', 'zh-TW');
    expect(en).toBeDefined();
    expect(zh).toBeDefined();
    expect(zh!.title).not.toBe(en!.title);
    expect(zh!.content).not.toBe(en!.content);
  });

  it('returns zh-TW challenge entry when translation exists', () => {
    const slug = 'dopamine-detox';
    const date = '2026-06-28';
    const enEntry = getChallengeBySlug(slug, 'en')?.entries.find((e) => e.date === date);
    const zhEntry = getChallengeBySlug(slug, 'zh-TW')?.entries.find((e) => e.date === date);
    expect(enEntry).toBeDefined();
    expect(zhEntry).toBeDefined();
    expect(zhEntry!.content).not.toBe(enEntry!.content);
  });

  it('returns zh-TW blog post when translation exists', () => {
    const en = getPostBySlug('hello-world', 'en');
    const zh = getPostBySlug('hello-world', 'zh-TW');
    expect(en).toBeDefined();
    expect(zh).toBeDefined();
    expect(zh!.content).not.toBe(en!.content);
  });

  it('serves travel content without a locale dimension (implicit English fallback)', () => {
    const trip = getTripBySlug('kyoto-autumn');
    expect(trip).toBeDefined();
    expect(trip!.title.length).toBeGreaterThan(0);
  });
});

describe('localized content-meta URLs', () => {
  it('builds matching EN and zh-TW wiki URLs', async () => {
    const { getWikiPageMeta, getChallengesListMeta } = await import('../src/lib/content-meta');
    const en = getWikiPageMeta('dopamine-detox', 'en');
    const zh = getWikiPageMeta('dopamine-detox', 'zh-TW');
    expect(en!.url).toBe('/wiki/dopamine-detox');
    expect(zh!.url).toBe('/zh-TW/wiki/dopamine-detox');

    const enList = getChallengesListMeta('en');
    const zhList = getChallengesListMeta('zh-TW');
    expect(enList.url).toBe('/challenges');
    expect(zhList.url).toBe('/zh-TW/challenges');
  });
});
