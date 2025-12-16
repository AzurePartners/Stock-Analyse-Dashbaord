/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bloomberg-blue': '#0E4C92',
        'bloomberg-dark': '#1a1a1a',
        'bloomberg-light': '#f5f5f5',
        'purity-bg': '#F7FAFC',
        'purity-card': '#FFFFFF',
        'purity-border': '#E2E8F0',
        'purity-text': '#1A202C',
        'purity-mint': '#2ED7C3',
        'purity-teal': '#13C4A3',
        'purity-navy': '#0B1E2D',
        'purity-navy-2': '#142842',
      },
    },
  },
  plugins: [],
}

