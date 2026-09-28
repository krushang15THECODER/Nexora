/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We'll toggle this manually or via OS preference
  theme: {
    extend: {
      colors: {
        // Light Mode Palette
        ivory: '#F9F8F6', // Warm cream background
        charcoal: '#1A1A1A', // Near-black primary text
        terracotta: '#C16A54', // Muted terracotta accent
        warmGray: '#8C8985', // Warm gray secondary text
        subtleBorder: '#E5E3DF', // Beige/gray borders
        
        // Dark Mode Palette
        deepCharcoal: '#121212', // Near-black background
        warmOffWhite: '#F0EFEB', // Warm off-white text
        darkWarmGray: '#242424', // Dark warm-gray surfaces
        darkSubtleBorder: '#333333', // Low-contrast borders
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Merriweather"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
