import daisyui from 'daisyui';
import daisyuiThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      "black", // Default theme
      {
        black: {
          ...daisyuiThemes["black"],
          primary: "rgb(29,155,240)",
          secondary: "rgb(24,24,24)"
        }
      }
    ]
  }
}
