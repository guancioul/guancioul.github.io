import { useEffect } from 'react';

export function formatDocumentTitle(pageTitle: string | undefined, siteName: string): string {
  if (!pageTitle) return siteName;
  return `${pageTitle} — ${siteName}`;
}

export function useDocumentTitle(pageTitle: string | undefined, siteName: string) {
  useEffect(() => {
    document.title = formatDocumentTitle(pageTitle, siteName);
  }, [pageTitle, siteName]);
}
