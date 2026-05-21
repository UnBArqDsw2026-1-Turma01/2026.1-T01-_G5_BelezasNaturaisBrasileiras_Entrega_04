/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#16a34a',
          'green-light': '#22c55e',
          'green-dark': '#15803d',
        },
      },
    },
  },
  plugins: [],
}
