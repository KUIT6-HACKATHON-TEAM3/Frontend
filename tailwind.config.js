/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F4F9F1",
          500: "#3E6B4F",
          900: "#B3B3B3"  // transition color
        },
        emphasize: {
          500: "#3E6B4F",
        },
        text: {
          200: "#7B7B7B",
          300: "#3D3D3D",
          500: "#1B1B1B"
        },
        component: {
          500: "#FCFDFB"
        }
      }
    },
  },
  plugins: [],
}

