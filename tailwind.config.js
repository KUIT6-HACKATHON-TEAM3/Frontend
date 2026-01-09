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
<<<<<<< HEAD
          500: "#3E6B4F"
=======
          500: "#A8E063",
          900: "#00FF42"
>>>>>>> develop
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

