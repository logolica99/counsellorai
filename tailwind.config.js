/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      raleway: ["Raleway", "Serif"],
    },
    extend: {
      colors: {
        red: "#F03A47",
        darkBlue: "#003D61",
        cream: "#DFCD9B",
        lightCream: "#FFF0C7",
        gray: "#5A5959",
      },

      screens: {
   
      },
    },
  },

  plugins: [],
};
