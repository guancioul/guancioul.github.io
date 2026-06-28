import type { Locale } from '../i18n';
import { switchLocalePath } from './locale-path';

export const LOCALE_SWITCH_SCROLL_KEY = 'locale-switch-scroll';

export function buildLocaleSwitchUrl(
  pathname: string,
  search: string,
  hash: string,
  targetLocale: Locale,
): string {
  return `${switchLocalePath(pathname, targetLocale)}${search}${hash}`;
}

export function saveLocaleSwitchScroll(): void {
  try {
    sessionStorage.setItem(LOCALE_SWITCH_SCROLL_KEY, String(window.scrollY));
  } catch {
    // sessionStorage unavailable
  }
}
