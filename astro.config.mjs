import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://iberi22.github.io',
  base: '/software-factory-site',
  output: 'static',
  integrations: [tailwind()],
});
