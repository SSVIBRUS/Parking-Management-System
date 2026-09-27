/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#090d16',
          card: '#131b2e',
          accent: '#38bdf8',
          emerald: '#10b981',
          gold: '#f59e0b',
          pink: '#ec4899',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
