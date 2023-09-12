/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  theme: {
    extend: {
      maxWidth: {
        '4/5': '80%',
        'overlay': '78%',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
