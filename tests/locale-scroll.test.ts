import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LOCALE_SWITCH_SCROLL_KEY,
  buildLocaleSwitchUrl,
  saveLocaleSwitchScroll,
} from '../src/lib/locale-scroll';

describe('buildLocaleSwitchUrl', () => {
  it('preserves query string and hash when switching locale', () => {
    expect(
      buildLocaleSwitchUrl('/wiki/foo', '?scrollTo=about', '#section', 'zh-TW'),
    ).toBe('/zh-TW/wiki/foo?scrollTo=about#section');
  });

  it('strips zh-TW prefix when switching back to English', () => {
    expect(
      buildLocaleSwitchUrl('/zh-TW/challenges/project-50', '', '#day-6', 'en'),
    ).toBe('/challenges/project-50#day-6');
  });
});

describe('saveLocaleSwitchScroll', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores the current scroll position for post-navigation restore', () => {
    Object.defineProperty(window, 'scrollY', { value: 842, configurable: true });
    saveLocaleSwitchScroll();
    expect(sessionStorage.getItem(LOCALE_SWITCH_SCROLL_KEY)).toBe('842');
  });

  it('does not throw when sessionStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => saveLocaleSwitchScroll()).not.toThrow();
  });
});
