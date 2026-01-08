/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#F0F2EA",
          500: "#B9BE94"
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

