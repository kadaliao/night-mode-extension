/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nightMode: {
          background: '#121212',
          surface: '#1e1e1e',
          primary: '#bb86fc',
          secondary: '#03dac6',
          text: '#e0e0e0',
          textSecondary: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
} 