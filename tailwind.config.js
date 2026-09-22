/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0d1116',
        darkCard: '#14181f',
        neonGreen: '#00df8f',
        neonGreenDark: '#00b373',
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 223, 143, 0.3)',
        'neon-strong': '0 0 35px rgba(0, 223, 143, 0.5)',
      }
    },
  },
  plugins: [],
}
