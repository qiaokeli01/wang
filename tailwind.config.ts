import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad7a5',
          300: '#f7ba6d',
          400: '#f39333',
          500: '#f0760c',
          600: '#e15d07',
          700: '#ba4509',
          800: '#94370e',
          900: '#782f0f',
        },
        edu: {
          blue: '#4A90D9',
          green: '#52C41A',
          purple: '#7B61FF',
          pink: '#FF6B9D',
          yellow: '#FFB800',
        }
      },
    },
  },
  plugins: [],
}
export default config
