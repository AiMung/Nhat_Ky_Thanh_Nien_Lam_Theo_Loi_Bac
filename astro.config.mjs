import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Thay đổi base khi deploy lên GitHub Pages dạng https://<user>.github.io/<repo>/
  // Nếu có custom domain (vd: kyucviet.vn), đặt BASE_PATH=/
  site: process.env.SITE_URL || 'https://dtn-hcm.github.io',
  base: process.env.BASE_PATH || '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react()
  ],
  output: 'static'
});

