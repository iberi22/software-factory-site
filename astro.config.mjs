import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://iberi22.github.io',
  // Only use base path in production build (for GitHub Pages)
  // In development, serve at root for easier testing
  base: process.env.NODE_ENV === 'production' ? '/software-factory-site' : undefined,
  output: 'static',
  integrations: [tailwind()],
});
