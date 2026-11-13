import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Thay đổi base khi deploy lên GitHub Pages dạng https://<user>.github.io/<repo>/
  // Nếu có custom domain (vd: kyucviet.vn), đặt BASE_PATH=/
  site: process.env.SITE_URL || 'https://aimung.github.io',
  base: process.env.BASE_PATH || '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react()
  ],
  vite: {
    optimizeDeps: {
      include: [
        'highcharts',
        'highcharts/highmaps',
        'highcharts/modules/drilldown',
        'highcharts-react-official'
      ]
    },
    resolve: {
      alias: {
        'highcharts/highmaps': 'highcharts/highmaps.js',
        'highcharts/modules/drilldown': 'highcharts/modules/drilldown.js'
      }
    }
  },
  output: 'static'
});

