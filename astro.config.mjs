import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://guancioul.github.io',
  base: '/',
  integrations: [react()],
  build: {
    format: 'directory',
  },
});
