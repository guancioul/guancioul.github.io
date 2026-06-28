import { useCallback } from 'react';
import { localizedPath } from '../lib/locale-path';
import { useTranslation } from './useTranslation';

export function useLocalizedPath() {
  const { locale } = useTranslation();
  return useCallback((path: string) => localizedPath(locale, path), [locale]);
}
