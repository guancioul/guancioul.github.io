import { mockSiteViewCount } from './mockData';

const NAMESPACE = 'guancioul.github.io';
const KEY = 'site-views';

export async function trackSiteView(): Promise<number> {
  if (import.meta.env.DEV) return mockSiteViewCount;

  const res = await fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`);
  const data = await res.json();
  return data.value as number;
}
