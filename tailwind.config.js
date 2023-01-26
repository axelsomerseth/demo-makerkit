const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Bitter', 'serif'],
        sans: [
          'SF Pro Text',
          'Inter',
          'system-ui',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Ubuntu',
        ],
        monospace: [`SF Mono`, `ui-monospace`, `Monaco`, 'Monospace'],
      },
      colors: {
        primary: {
          ...colors.blue,
          contrast: '#fff',
        },
        black: {
          50: '#525252',
          100: '#363636',
          200: '#282828',
          300: '#222',
          400: '#121212',
          500: '#0a0a0a',
          600: '#040404',
          700: '#000',
        },
      },
    },
  },
  plugins: [ellipisfyPlugin],
};

function ellipisfyPlugin({ addUtilities }) {
  const styles = {
    '.ellipsify': {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'white-space': 'pre',
    },
  };

  addUtilities(styles);
}
