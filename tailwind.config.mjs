/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        heritage: {
          50: '#FDFBF7',
          100: '#FAF5ED',
          200: '#F3E9D7',
          300: '#E7D5BA',
          400: '#D5BA92',
          500: '#B89767',
          600: '#9B774B',
          700: '#7B5B37',
          800: '#5F452A',
          900: '#473320',
        },
        redflag: {
          50: '#FFF1F1',
          100: '#FFE1E1',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        moss: {
          600: '#3D5A40',
          700: '#2E4331',
          800: '#1F2F23',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Lora', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

