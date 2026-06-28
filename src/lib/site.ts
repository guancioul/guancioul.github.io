export const SITE_NAME = 'Kuan-Hao Lai';
export const SITE_URL = 'https://guancioul.github.io';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export function formatPageTitle(pageTitle: string | undefined): string {
  if (!pageTitle) return SITE_NAME;
  return `${pageTitle} — ${SITE_NAME}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}
