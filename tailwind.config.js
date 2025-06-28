/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F7941D',
        accent: '#3D3D3D',
        neutral: {
          50: '#FFFFFF',
          100: '#F9F9F9',
          200: '#F4F4F4',
          300: '#E5E5E5',
          400: '#D4D4D4',
          500: '#ADADAD',
          600: '#8A8A8A',
          700: '#636363',
          800: '#3D3D3D',
          900: '#333333',
        },
        success: {
          50: '#E6F7EC',
          500: '#10B981',
          700: '#047857',
        },
        warning: {
          50: '#FFF7E6',
          500: '#F59E0B',
          700: '#B45309',
        },
        error: {
          50: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};