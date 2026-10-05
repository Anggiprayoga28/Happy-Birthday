/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#010a17',
          900: '#03045e',
          800: '#023e8a',
          700: '#0077b6',
          600: '#0096c7',
          500: '#00b4d8',
          400: '#38bdf8',
          300: '#90e0ef',
        },
        cyan: {
          neon: '#00f5d4',
          glow: 'rgba(0, 245, 212, 0.65)',
        },
        retro: {
          green: '#48ea77',
        },
        gold: {
          accent: '#f7d070',
        },
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        sans: ['"Montserrat"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 245, 212, 0.6), 0 0 30px rgba(0, 245, 212, 0.3)',
        'neon-blue': '0 0 20px rgba(56, 189, 248, 0.5), 0 0 40px rgba(2, 62, 138, 0.4)',
        'gold-glow': '0 0 15px rgba(247, 208, 112, 0.5)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.985)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [],
};
