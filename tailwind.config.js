/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mountain: {
          blue: '#1a365d',
          'blue-light': '#2c5282',
          'blue-dark': '#0f2440'
        },
        sunrise: {
          DEFAULT: '#ed8936',
          light: '#f6ad55',
          dark: '#dd6b20'
        },
        summit: {
          success: '#38a169',
          warning: '#d69e2e',
          danger: '#e53e3e'
        },
        class: {
          1: '#38a169',
          2: '#3182ce',
          3: '#d69e2e',
          4: '#e53e3e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      },
      screens: {
        xs: '375px'
      },
      borderRadius: {
        card: '0.75rem'
      }
    }
  },
  plugins: []
};
