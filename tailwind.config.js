const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#07070b',
        line: 'rgba(255,255,255,0.08)',
        lime: '#c6ff3d',
        wa: '#25d366',
        violet: { ...colors.violet, DEFAULT: '#8b5cf6' },
      },
    },
  },
};
