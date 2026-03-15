/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        proof: {
          bg: '#0A0A0B',
          card: '#111113',
          border: '#1E1E21',
          amber: '#D4A853',
          amberLight: '#E8C878',
          amberDark: '#A67C2E',
          green: '#22C55E',
          red: '#EF4444',
          orange: '#F97316',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
