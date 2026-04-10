/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        uberBlack: "#000",
        uberGreen: "#06c167"
      },
      backgroundImage: {
        'uber-home': "url('/src/assets/homepage-bg2.jpg')",  // ✅ Ensure this is the correct path
      }
    },
  },
  plugins: [],
};