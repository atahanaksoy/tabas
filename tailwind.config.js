module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "dim"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
