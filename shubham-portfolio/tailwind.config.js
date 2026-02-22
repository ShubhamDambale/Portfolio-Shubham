/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        li: {
          blue: '#0a66c2',
          'blue-dark': '#004182',
          'blue-light': '#e8f0fe',
          green: '#057642',
          'green-bg': '#e7f5ec',
        },
      },
      boxShadow: {
        card: '0 0 0 1px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06)',
        'card-hover': '0 0 0 1px rgba(0,0,0,.12), 0 8px 24px rgba(0,0,0,.10)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
