/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './lib/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mountain: {
          blue: '#1a365d',
          'blue-light': '#2c5282',
          'blue-dark': '#0f2440',
          navy: '#0c1929',
          slate: '#1e3a5f',
          mist: '#3d5a80'
        },
        accent: {
          DEFAULT: '#C8A55C',
          light: '#D4BC7E',
          dark: '#A8873A',
          warm: '#DAC48A',
          muted: '#B09860'
        },
        alpine: {
          pine: '#1d4e3e',
          forest: '#166534',
          meadow: '#65a30d',
          rock: '#78716c',
          snow: '#f8fafc',
          ice: '#e0f2fe'
        },
        semantic: {
          success: {
            DEFAULT: '#4A9E7E',
            light: '#6AB89A',
            dark: '#3A8168',
          },
          danger: {
            DEFAULT: '#C75454',
            light: '#D97777',
            dark: '#A84444',
          },
          warning: {
            DEFAULT: '#D4A843',
            light: '#E0BE6E',
            dark: '#B08D36',
          }
        },
        class: {
          1: '#5A9E78',
          2: '#4A7FB5',
          3: '#C4943F',
          4: '#B84C4C'
        }
      },
      fontFamily: {
        sans: ['Inter'],
        display: ['InstrumentSerif']
      },
      borderRadius: {
        card: 12
      }
    }
  },
  plugins: []
};
