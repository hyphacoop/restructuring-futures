/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
