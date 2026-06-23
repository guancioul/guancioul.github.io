import { en } from './en';
import { zhTW } from './zh-TW';

export type Locale = 'en' | 'zh-TW';

export const locales: Record<Locale, typeof en> = {
  en,
  'zh-TW': zhTW,
};

export const defaultLocale: Locale = 'en';
