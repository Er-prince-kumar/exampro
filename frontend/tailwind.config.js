/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b132b',
          navyLight: '#1c2541',
          cyan: '#00b4d8',
          cyanLight: '#90e0ef',
          cyanSoft: '#e0f7fa',
          accent: '#06d6a0',
          warning: '#f59e0b',
          danger: '#ef4444',
          card: '#131e3a',
          surface: '#172554'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

