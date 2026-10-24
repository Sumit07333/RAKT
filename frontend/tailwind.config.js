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
          red: '#C41315',
          'red-hover': '#A20D10',
          'bright-red': '#E82A25',
          navy: '#273741',
          'soft-red': '#FFF1F1',
          'light-slate': '#EEF2F4',
          'border': '#E2E8EC',
          'muted': '#64748B',
        },
        semantic: {
          success: '#16803C',
          warning: '#B45309',
          danger: '#C41315',
          info: '#2563EB',
          disabled: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(39, 55, 65, 0.06), 0 1px 3px -1px rgba(39, 55, 65, 0.04)',
        'card': '0 4px 20px -2px rgba(39, 55, 65, 0.08)',
        'modal': '0 20px 40px -10px rgba(39, 55, 65, 0.18)',
      }
    },
  },
  plugins: [],
}
