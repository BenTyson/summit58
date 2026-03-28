/**
 * Programmatic color tokens for contexts where NativeWind classes don't apply
 * (maps, charts, StatusBar, native components).
 * Source of truth: tailwind.config.js
 */
export const colors = {
  mountain: {
    blue: '#1a365d',
    blueLight: '#2c5282',
    blueDark: '#0f2440',
    navy: '#0c1929',
    slate: '#1e3a5f',
    mist: '#3d5a80',
  },
  accent: {
    default: '#C8A55C',
    light: '#D4BC7E',
    dark: '#A8873A',
    warm: '#DAC48A',
    muted: '#B09860',
  },
  alpine: {
    pine: '#1d4e3e',
    forest: '#166534',
    meadow: '#65a30d',
    rock: '#78716c',
    snow: '#f8fafc',
    ice: '#e0f2fe',
  },
  class: {
    1: '#5A9E78',
    2: '#4A7FB5',
    3: '#C4943F',
    4: '#B84C4C',
  },
  semantic: {
    success: '#4A9E7E',
    danger: '#C75454',
    warning: '#D4A843',
  },
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f7fafc',
    bgTertiary: '#edf2f7',
    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    border: '#e2e8f0',
    borderStrong: '#cbd5e0',
  },
  dark: {
    bgPrimary: '#1a202c',
    bgSecondary: '#2d3748',
    bgTertiary: '#4a5568',
    textPrimary: '#f7fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#a0aec0',
    border: '#4a5568',
    borderStrong: '#718096',
  },
} as const;
