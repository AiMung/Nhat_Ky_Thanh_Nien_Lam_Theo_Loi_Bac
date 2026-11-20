import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Thay đổi base khi deploy lên GitHub Pages dạng https://<user>.github.io/<repo>/
  // Tự động tương thích với tài khoản Đoàn Phường Xuân Hương - Đà Lạt
  site: process.env.SITE_URL || 'https://doanthanhnienxuanhuong-dalat.github.io',
  base: process.env.BASE_PATH || '/Nhat_Ky_Thanh_Nien_Lam_Theo_Loi_Bac',
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

