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
        navy: {
          950: '#071B3D',
          900: '#081f3f',
          800: '#0b2b55',
        },
        romania: {
          blue: {
            700: '#2F6FED',
            600: '#1554bd',
            500: '#2f6bd1',
            100: '#e7efff',
            50: '#f3f7ff',
          },
          yellow: {
            500: '#2F6FED',
            400: '#ffda39',
            100: '#fff2a6',
            50: '#fffbdf',
          },
          red: {
            700: '#a50f20',
            600: 'transparent',
            100: '#ffe5e9',
            50: '#fff3f5',
          }
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#eef3f8',
          blue: '#f3f7ff',
        }
      },
      fontFamily: {
        persian: ['Vazirmatn', 'sans-serif'],
        english: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
