/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zgroup: {
          blue: "#1a2c4e",
          ice: "#dce5f4",
          dark: "#0f172a",
          red: "#dc3545",
        },
      },
    },
  },
  plugins: [],
};
