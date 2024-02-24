import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from "@astrojs/react";
import vercel from '@astrojs/vercel/static';
// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 8,
  }),
  integrations: [tailwind({applyBaseStyles: false}), react()],
  experimental: {
    assets: true
  }
});