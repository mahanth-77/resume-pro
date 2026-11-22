/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F7F4',
        surface: '#FFFFFF',
        ink: '#0F172A',
        stone: '#64748B',
        accent: '#0F766E',
        'accent-hover': '#115E59',
        border: '#E2E8F0',
        success: '#15803D',
        warning: '#C2410C',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}