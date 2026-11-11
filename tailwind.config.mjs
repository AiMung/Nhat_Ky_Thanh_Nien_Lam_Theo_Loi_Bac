/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        doan: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#0052A3', // Xanh thanh niên chuẩn huy hiệu Đoàn
          900: '#003A75',
        },
        redflag: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B', // Đỏ son cờ Tổ quốc
          900: '#7F1D1D',
          950: '#450A0A',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        heritage: {
          50: '#FAF8F5',
          100: '#F5F0EA',
          200: '#EAE1D5',
          300: '#D8C9B8',
          600: '#786857',
          700: '#5C4E40',
          800: '#43372B',
          900: '#2D2319',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-hover': '0 12px 30px -10px rgba(0, 82, 163, 0.15)',
        'hero': '0 20px 40px -15px rgba(153, 27, 27, 0.25)',
      }
    },
  },
  plugins: [],
};
