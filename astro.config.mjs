import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://guancioul.github.io',
  base: '/',
  integrations: [react()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-TW'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    format: 'directory',
  },
});
