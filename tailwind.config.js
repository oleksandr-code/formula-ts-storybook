/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': '11px',
      },

      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
