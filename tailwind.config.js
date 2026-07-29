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
          blue: '#0038A8',
          'blue-dark': '#002B7F',
          'blue-deep': '#071E3D',
          yellow: '#FCD116',
          'yellow-soft': '#FFF7CC',
          red: '#CE1126',
          'red-dark': '#A80E20',
          'red-soft': '#FFF0F2',
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
