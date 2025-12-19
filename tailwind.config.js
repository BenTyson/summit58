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
          'blue-dark': '#0f2440',
          navy: '#0c1929',
          slate: '#1e3a5f',
          mist: '#3d5a80'
        },
        sunrise: {
          DEFAULT: '#ed8936',
          light: '#f6ad55',
          dark: '#dd6b20',
          gold: '#fbbf24',
          amber: '#f59e0b',
          coral: '#fb7185'
        },
        alpine: {
          pine: '#1d4e3e',
          forest: '#166534',
          meadow: '#65a30d',
          rock: '#78716c',
          snow: '#f8fafc',
          ice: '#e0f2fe'
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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif']
      },
      screens: {
        xs: '375px'
      },
      borderRadius: {
        card: '0.75rem'
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.08)',
        'card-elevated': '0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(0, 0, 0, 0.08)',
        'glow-sunrise': '0 0 40px rgba(237, 137, 54, 0.3)',
        'glow-class-1': '0 0 20px rgba(56, 161, 105, 0.3)',
        'glow-class-2': '0 0 20px rgba(49, 130, 206, 0.3)',
        'glow-class-3': '0 0 20px rgba(214, 158, 46, 0.3)',
        'glow-class-4': '0 0 20px rgba(229, 62, 62, 0.3)'
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};
