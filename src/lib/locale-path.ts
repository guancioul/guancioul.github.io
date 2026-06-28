import { defaultLocale, type Locale } from '../i18n';

const ZH_TW_PREFIX = '/zh-TW';

/** Locale-neutral path (always starts with `/`, never includes `/zh-TW`). */
export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  if (normalized === '/') return `${ZH_TW_PREFIX}/`;
  return `${ZH_TW_PREFIX}${normalized}`;
}

export function parseLocaleFromPath(pathname: string): { locale: Locale; path: string } {
  if (pathname === ZH_TW_PREFIX || pathname.startsWith(`${ZH_TW_PREFIX}/`)) {
    const path = pathname === ZH_TW_PREFIX ? '/' : pathname.slice(ZH_TW_PREFIX.length) || '/';
    return { locale: 'zh-TW', path };
  }
  return { locale: defaultLocale, path: pathname || '/' };
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const { path } = parseLocaleFromPath(pathname);
  return localizedPath(targetLocale, path);
}

export function notFoundPath(locale: Locale): string {
  return localizedPath(locale, '/404');
}
