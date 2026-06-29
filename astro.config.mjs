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
  vite: {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      exclude: ['react-icons', 'react-icons/si'],
    },
    ssr: {
      noExternal: ['react-icons'],
    },
  },
});
