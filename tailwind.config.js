/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00004e',
        'hover': '#00004e',
        'active': '#eaeaff',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}