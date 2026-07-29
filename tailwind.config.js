/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        romania: {
          blue: '#002B7F',
          yellow: '#FCD116',
          red: '#CE1126',
        }
      },
      fontFamily: {
        persian: ['Vazirmatn', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
