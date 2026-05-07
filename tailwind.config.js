const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        morandi: {
          50: '#f7f5f2',
          100: '#e8e3db',
          200: '#d5cdc1',
          300: '#bfb4a3',
          400: '#a99b89',
          500: '#958572',
          600: '#7d6e5d',
          700: '#65594b',
          800: '#52483d',
          900: '#453d34',
        },
        zen: {
          bg: '#f5f2ed',
          card: '#ffffff',
          text: '#2d2a26',
          muted: '#8a8580',
          accent: '#7c9a8e',
          accent2: '#c4a88a',
          accent3: '#d4a5a5',
        },
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
