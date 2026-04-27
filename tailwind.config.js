/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          background: '#ffffff',
          surface: '#f8fafc',
          alt: '#f1f5f9',
          border: '#e2e8f0',
          text: '#0f172a',
          secondary: '#64748b',
          accent: '#16a34a',
        },
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
          alt: '#334155',
          border: '#475569',
          text: '#f1f5f9',
          secondary: '#94a3b8',
          accent: '#22c55e',
        }
      }
    },
  },
  plugins: [],
}
