/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Màu đỏ rượu (Primary)
        primary: {
          DEFAULT: '#3E0C25', 
          hover: '#2a0819',
        },
        // Màu hồng phấn (Secondary)
        secondary: {
          DEFAULT: '#F9F1F0',
          dark: '#ebd5d1',
        },
        // Màu nhấn (Accent - Hồng đậm)
        accent: '#C75B7A', 
      },
      fontFamily: {
        // Nhớ import font trong index.html
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}