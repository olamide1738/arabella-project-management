/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        arabella: {
          50: '#F0F7F2',
          100: '#DCEFE1',
          200: '#BBE0C5',
          300: '#8DC99D',
          400: '#5AAB72',
          500: '#348D4F',
          600: '#00722C', // Arabella vibrant emerald
          700: '#005822',
          800: '#00421A',
          900: '#002E11', // Arabella primary forest
          950: '#001A09',
        },
        bdw: {
          50: '#FAF5FB',
          100: '#F3E8F5',
          200: '#E7D1EC',
          300: '#D5B0DC',
          400: '#B87DBD', // BDW studio signature
          500: '#9E5DA4',
          600: '#8F4894', // BDW architecture primary
          700: '#75377A',
          800: '#5C2D60',
          900: '#432246',
        },
        gold: {
          300: '#E2CE9E',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A98440',
        },
        stone: {
          850: '#1F1E1B',
          925: '#141412',
          950: '#0C0D0C',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
