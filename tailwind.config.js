/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00FF9D',
        secondary: '#2D7FF9',
        background: '#0D1117',
      },
    },
  },
  plugins: [],
};