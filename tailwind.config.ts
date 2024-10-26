import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
export default config