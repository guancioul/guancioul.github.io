import { describe, expect, it } from 'vitest';
import {
  localizedPath,
  notFoundPath,
  parseLocaleFromPath,
  switchLocalePath,
} from '../src/lib/locale-path';

describe('localizedPath', () => {
  it('keeps English paths unprefixed', () => {
    expect(localizedPath('en', '/')).toBe('/');
    expect(localizedPath('en', '/wiki/foo')).toBe('/wiki/foo');
  });

  it('prefixes zh-TW paths', () => {
    expect(localizedPath('zh-TW', '/')).toBe('/zh-TW/');
    expect(localizedPath('zh-TW', '/wiki/foo')).toBe('/zh-TW/wiki/foo');
  });

  it('normalizes paths without a leading slash', () => {
    expect(localizedPath('en', 'blog')).toBe('/blog');
    expect(localizedPath('zh-TW', 'challenges/x')).toBe('/zh-TW/challenges/x');
  });
});

describe('parseLocaleFromPath', () => {
  it('parses English routes', () => {
    expect(parseLocaleFromPath('/wiki/foo')).toEqual({ locale: 'en', path: '/wiki/foo' });
    expect(parseLocaleFromPath('/')).toEqual({ locale: 'en', path: '/' });
  });

  it('parses zh-TW routes', () => {
    expect(parseLocaleFromPath('/zh-TW')).toEqual({ locale: 'zh-TW', path: '/' });
    expect(parseLocaleFromPath('/zh-TW/wiki/foo')).toEqual({ locale: 'zh-TW', path: '/wiki/foo' });
  });
});

describe('switchLocalePath', () => {
  it('swaps locale while keeping the logical path', () => {
    expect(switchLocalePath('/wiki/dopamine-detox', 'zh-TW')).toBe('/zh-TW/wiki/dopamine-detox');
    expect(switchLocalePath('/zh-TW/challenges/project-50', 'en')).toBe('/challenges/project-50');
  });
});

describe('notFoundPath', () => {
  it('localizes 404 routes', () => {
    expect(notFoundPath('en')).toBe('/404');
    expect(notFoundPath('zh-TW')).toBe('/zh-TW/404');
  });
});

describe('round-trip', () => {
  it('switching locale twice returns to the original logical path', () => {
    const logical = '/challenges/dopamine-detox/2026-06-28';
    const zh = switchLocalePath(logical, 'zh-TW');
    expect(switchLocalePath(zh, 'en')).toBe(logical);
  });
});
